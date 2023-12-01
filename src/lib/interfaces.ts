export  interface Chart {
    title: string,
    endpoint: string,
    position: number
}

export interface TrajPlanner {
    position: number,
    mode: string,
    acc: number,
    vel: number,
    decel: number,
    delay: number,
    move_to: string
}

export interface Section {
    name: string,
    x: number,
    y: number,
    w: number,
    h: number,
    limit: Array<number>
    active: boolean;
}

export interface Macro {
    name: string,
    code: string
}

export interface Listener {
    interval: number,
    endpoints: Array<string>,
    worker: number | null,
    active: boolean
}

interface Size {
    rows: number,
    cols: number
}
export interface Config {
    size: Size,
    traj_planner: Array<TrajPlanner>;
    sections: Array<Section>,
    charts: Array<Chart>,
    showTitles: boolean
}

export interface IApiChild {
    name: string,
    type: string,
    unit: string
}

export interface IApi {
    name: string,
    type: string,
    unit?: string,
    childs: Array<IApiChild>
}

export interface Properties {
    max_acc: number
    max_dec: number
    max_vel: number
    t_accel: number
    t_decel: number
    t_total: number
    move_to: number
    delay: number
  }