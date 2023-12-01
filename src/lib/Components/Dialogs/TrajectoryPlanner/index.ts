import { toastsStore } from "$lib/Components/ui/toast";
import type { TrajPlanner, Properties } from "$lib/interfaces";
import { config, device } from "$lib/store";
import { get, writable } from "svelte/store";

export const current_index = writable<number | boolean>(false);
export const current_mode = writable<string>("velocity_limited");
export const loop = writable<boolean>(false);
export const actions = create_actions();

function create_actions() {
  const { subscribe, set } = writable<TrajPlanner[]>(get(config).traj_planner);

  const add = (properties: Properties) => {
    if (get(actions).length >= 10) return toastsStore.danger("10 trajectories maximum !");
    if (!properties.move_to) return toastsStore.danger("Position setpoint needed !");

    set([...get(actions), {
      position: get(actions).length,
      mode: get(current_mode),
      acc: get(current_mode) === "velocity_limited" ? properties.max_acc : properties.t_accel,
      vel: get(current_mode) === "velocity_limited" ? properties.max_vel : properties.t_total,
      decel: get(current_mode) === "velocity_limited" ? properties.max_dec : properties.t_decel,
      delay: get(current_mode) === "velocity_limited" ? properties.delay : properties.t_total * 1000,
      move_to: properties.move_to.toString(),
    }])
    return get(config).traj_planner;
  };

  const move = (action: TrajPlanner, direction: number) => {
    const targetIndex = get(actions).findIndex(
      (traj: TrajPlanner) => traj === action,
    );
    if (targetIndex === -1) return actions; // "traj introuvable";

    if (direction === 1 && targetIndex > 0) {
      get(actions)[targetIndex].position--;
      get(actions)[targetIndex - 1].position++;
    } else if (direction === -1 && targetIndex < get(actions).length - 1) {
      get(actions)[targetIndex].position++;
      get(actions)[targetIndex + 1].position--;
    }

    actions.set(get(actions).sort(
      (a: TrajPlanner, b: TrajPlanner) => a.position - b.position,
    ));
  }

  const remove = (action: TrajPlanner) => {
    set(get(actions).filter((n: any) => n !== action));
  }

  const send = async () => {
    for (let i = 0; i < get(actions).length; i++) {
      current_index.set(i);
      if (get(actions)[i].mode === "velocity_limited") {
        get(actions)[i].acc != get(device)?.data["traj_planner.max_accel"]
          ? get(device)?.send("traj_planner.max_accel", get(actions)[i].acc)
          : null;
        get(actions)[i].decel != get(device)?.data["traj_planner.max_decel"]
          ? get(device)?.send("traj_planner.max_decel", get(actions)[i].decel)
          : null;
        get(actions)[i].vel != get(device)?.data["traj_planner.max_vel"]
          ? get(device)?.send("traj_planner.max_vel", get(actions)[i].vel)
          : null;
        get(device)?.send("traj_planner.move_to", get(actions)[i].move_to);
      }
      if (get(actions)[i].mode === "time_limited") {
        get(actions)[i].acc != get(device)?.data["traj_planner.t_accel"]
          ? get(device)?.send("traj_planner.t_accel", get(actions)[i].acc)
          : null;
        get(actions)[i].decel != get(device)?.data["traj_planner.t_decel"]
          ? get(device)?.send("traj_planner.t_decel", get(actions)[i].decel)
          : null;
        get(actions)[i].vel != get(device)?.data["traj_planner.t_total"]
          ? get(device)?.send("traj_planner.t_total", get(actions)[i].vel)
          : null;
        get(device)?.send("traj_planner.move_to_tlimit", get(actions)[i].move_to);
      }
      if (get(actions)[i].delay > 0) {
        await sleep(get(actions)[i].delay);
      } else {
        // TODO: next action when reach position
        // while (Math.abs(parseInt(get(device)?.data["encoder.position_estimate"]) - parseInt(get(device)?.data["controller.position.setpoint"])) > parseInt(get(device)?.data["controller.velocity.deadband"])) {
        //   await sleep(1);
        // }
      }
    }
  }
  const execute = async () => {
    if (get(loop)) {
      while (get(loop)) {
        await send();
      }
    }
    await send();
    current_index.set(false);
  }

  return {
    subscribe,
    set,
    add,
    move,
    remove,
    execute,
  };
}



function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}