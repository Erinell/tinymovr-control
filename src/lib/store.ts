import { get, writable, readable } from 'svelte/store';
import type { WebSocketManager } from "$lib/WebSocket";
import { browser } from '$app/environment';
import type { Chart, Config, IApi, IApiChild, Macro, TrajPlanner } from '$lib/interfaces';
import { toastsStore } from './Components/ui/toast';
import { _ } from "svelte-i18n";

export const defaultConfig = readable<Config>({
  size: {
    rows: 12,
    cols: 12
  },
  sections: [
    { name: "modes", x: 0, y: 0, w: 3, h: 7, limit: [3, 4], active: true },
    { name: "infos", x: 3, y: 0, w: 9, h: 4, limit: [1, 4], active: true },
    { name: "charts", x: 3, y: 4, w: 9, h: 8, limit: [1, 4], active: true },
    { name: "macros", x: 0, y: 7, w: 3, h: 5, limit: [1, 4], active: true },
  ],
  charts: [
    {
      title: "Position estimate",
      endpoint: "encoder.position_estimate",
      position: 0,
    },
    {
      title: "Current estimate",
      endpoint: "controller.current.Iq_estimate",
      position: 1,
    },
  ],
  showTitles: true,
  traj_planner: []
});

function loadConfig() {
  if (!browser) return;
  const config = localStorage.getItem("config");
  return config ? JSON.parse(config) : null;
}

function loadMacros() {
  if (!browser) return;
  const macros = localStorage.getItem("macros");
  return macros ? JSON.parse(macros) : null;
}

export const device = writable<Device | null>();
export class Device {
  id: string;
  websocket: WebSocketManager;
  selected: boolean;
  routine: number;
  data: any;
  now: Date;

  constructor(device_id: string, websocket: WebSocketManager, selected = false) {
    this.id = device_id;
    this.websocket = websocket;
    this.selected = selected;
    this.routine = 0;
    this.data = {};
    this.now = new Date();
  }

  getAPIlist(api: any) {
    let _api: any = [];

    api.forEach((section: any) => {
      if (section.childs.length === 0) {
        _api.push(section.name);
      } else {
        section.childs.forEach((endpoint: any) => {
          _api.push(`${section.name}.${endpoint.name}`);
        });

      };
    });
    return _api;
  }

  send(request: string, value: string | number | null = null, callback: any = null) {
    let key = request ? `${this.id}.${request}` : this.id;
    this.websocket.send(key, value, callback);
  }

  parseFormat(data: string, type: string, flags?: any) {
    if (type === "float") {
      let value = parseFloat(data);
      if (value != 0 && value < 0.01) return value.toFixed(6);
      return value.toFixed(2);
    }

    if (type == "uint32" || type == "bool") {
      return data;
    }

    if (type == "uint8") {
      if (!flags) return data;
      return data != "0" ? flags[data].toLowerCase() : "-";
    }

    if (type == "tick") {
      return data;
    }
  }

  fetchDataOnce(api: any) {
    let filter_type = ["bool", "float", "uint32", "int8", "uint8"]

    api.forEach((section: any) => {
      if (section.childs.length == 0 && filter_type.includes(section.type)) {
        this.websocket.send(`${this.id}.${section.name}`, null, (res: any) => {
          this.data[section.name] = this.parseFormat(res, section.type, section.flags ?? null);
        });
      }
      section.childs.forEach((endpoint: any) => {
        if (filter_type.includes(endpoint.type)) {
          this.websocket.send(`${this.id}.${section.name}.${endpoint.name}`, null, (res: any) => {
            this.data[`${section.name}.${endpoint.name}`] = this.parseFormat(res, endpoint.type, endpoint.flags ?? null);
          });
        }
      });

    });
    return this.data;
  }

  fetchData(api: any, endpoints: Array<string>) {
    this.now = new Date();
    let filter = endpoints;

    api.forEach((section: any) => {
      if (section.childs.length == 0 && filter.some(n => n.includes(section.name))) {
        this.websocket.send(`${this.id}.${section.name}`, null, (res: any) => {
          this.data[section.name] = this.parseFormat(res, section.type, section.flags ?? null);
        });
      }

      section.childs.forEach((endpoint: any) => {
        if (filter.some(n => `${section.name}.${endpoint.name}`.includes(n))) {
          this.websocket.send(`${this.id}.${section.name}.${endpoint.name}`, null, (res: any) => {
            this.data[`${section.name}.${endpoint.name}`] = this.parseFormat(res, endpoint.type, endpoint.flags ?? null);
          });
        }
      });
    });
    return this.data;
  }
}

export const devices_store = create_devices();
function create_devices() {
  const { subscribe, set, update } = writable<Array<Device>>([]);
  const add = (id: string, websocket: WebSocketManager) => {
    if (get(devices_store).find(n => n.id === id)) return;
    update((n) => ([...n, new Device(id, websocket, (n.length == 0))]));
  };

  const getActive = () => {
    return get(devices_store).find(n => n.selected === true) ?? get(devices_store)[0];
  }

  const select = (id?: string): Device => {
    return get(devices_store).find(n => n.id === id) ?? get(devices_store)[0];
  }

  const remove = (id: string) => {
    devices_store.update((n: Array<Device>) => n.filter((n: Device) => n.id === id));
  }

  const size = () => {
    return get(devices_store).length;
  }

  return {
    subscribe,
    add,
    getActive,
    select,
    remove,
    update,
    size,
    reset: () => set([]),
  };
}

export const API = create_API();
function create_API() {
  const { subscribe, set, update } = writable<Array<IApi>>([]);

  const toEndpoints = () => {
    let endpoints: Array<string> = [];

    get(API).forEach((section: IApi) => {
      if (section.childs.length === 0) {
        endpoints.push(section.name);
      } else {
        section.childs.forEach((endpoint: IApiChild) => {
          endpoints.push(`${section.name}.${endpoint.name}`);
        });
      };
    });
    return endpoints;
  }

  const getUnit = (endpoint: string) => {
    for (let i = 0; i < get(API).length; i++) {
      const section = get(API)[i];
      if (section.name === endpoint) {
        return section.unit;
      }
      for (let j = 0; j < section.childs.length; j++) {
        const _endpoint = get(API)[i].childs[j]
        if (endpoint.includes(_endpoint.name)) {
          return _endpoint.unit;
        }
      }
    }
  }

  return {
    subscribe,
    set,
    update,
    toEndpoints,
    getUnit
  }
}

export const config = create_config();
function create_config() {
  const { subscribe, set, update } = writable<Config>(loadConfig() ?? get(defaultConfig));

  const moveChart = (endpoint: string, direction: number) => {
    const targetIndex = get(config).charts.findIndex((chart) => chart.endpoint === endpoint);
    if (targetIndex === -1) return get(config).charts; // "Graphique introuvable";

    if (direction === 1 && targetIndex > 0) {
      get(config).charts[targetIndex].position--;
      get(config).charts[targetIndex - 1].position++;
    } else if (direction === -1 && targetIndex < get(config).charts.length - 1) {
      get(config).charts[targetIndex].position++;
      get(config).charts[targetIndex + 1].position--;
    }

    get(config).charts = get(config).charts.sort((a, b) => a.position - b.position);
    return get(config).charts;

  }

  const removeChart = (endpoint: string) => {
    get(config).charts = get(config).charts.filter((n: Chart) => n.endpoint !== endpoint);
    return get(config).charts;
  }

  const sizeCharts = () => {
    return get(config).charts.length;
  }

  const setTrajPlanner = (trajectories: TrajPlanner[]) => {
    get(config).traj_planner = trajectories;
  }

  return {
    subscribe,
    update,
    set,
    moveChart,
    removeChart,
    sizeCharts,
    setTrajPlanner
  }

}

export const macros = create_macros();
function create_macros() {
  const { subscribe, set } = writable<Macro[]>(loadMacros() ?? [{ name: "Example", code: "a = 0;\nwhile (a < 5) {\n  print(a);\n  sleep(1000);\n  a = a+1;\n}" }]);

  const add = (name: string, code: string) => {
    if (name.length === 0) { toastsStore.danger(get(_)("macro-name-required")); return true; }
    if (get(macros).find(m => m.name === name)) { toastsStore.danger(get(_)("macro-already-exist")); return true; };
    let new_macro = {
      name,
      code
    }
    set([...get(macros), new_macro])
    return false;
  }

  const save = (name: string, code: string) => {
    const targetIndex = get(macros).findIndex((m: Macro) => m.name === name);
    if (targetIndex === -1) return add(name, code);

    get(macros)[targetIndex] = { name, code };
  }

  const remove = (name: string) => {
    set(get(macros).filter((m: any) => m.name !== name));
  }

  return {
    subscribe,
    set,
    add,
    remove,
    save
  }
}


const defaultLoops = writable([
  {
    id: 0,
    interval: 1000,
    endpoints: [
      "Vbus",
      "Ibus",
      "power",
      "temp",
      "errors",
      "calibrated",
      "controller.state",
      "controller.mode",
      "controller.position.",
      "controller.velocity.",
    ],
    worker: 0,
    active: true,
  },
  {
    id: 1,
    interval: 100,
    endpoints: [
      "encoder.position_estimate",
      "controller.current.Iq_estimate",
    ],
    worker: 0,
    active: true,
  },
])

export const loop = create_loop();
function create_loop() {
  const { set } = writable();

  const run = async (id: number, interval: number) => {
    if (get(defaultLoops)[id].active === false) return;
    if (get(device)) {
      get(device)?.fetchData(get(API), get(defaultLoops)[id].endpoints);
    }

    setTimeout(run, interval, id, interval);
  }

  const stop = (id: number) => {
    get(defaultLoops)[id].active = false;
  }

  const stopAll = () => {
    get(defaultLoops).map(c => c.active = false);
  }

  const activeAll = () => {
    get(defaultLoops).map(c => c.active = true);
  }

  return {
    set,
    activeAll,
    run,
    stop,
    stopAll
  }
}

export const editable_sections = writable<boolean>(false);
export const remove_sections = writable<boolean>(false);