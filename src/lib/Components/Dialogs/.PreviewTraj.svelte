<script lang="ts">
    import { Dialog, Label, Input, Button, Popover, Command } from "$lib";
    import { LineChart } from "lucide-svelte";
    import { _ } from "svelte-i18n";
    import Chart, { Type } from "$lib/Components/Chart.svelte";
    import { config } from "$lib/store";

    export let open = false;
    export let onClose = () => {};

    let res_x: Array<number> = [];
    let res_y: Array<number> = [];

    $: delay = $config.traj_planner.map((n) => n.delay / 1000);
    $: acc = $config.traj_planner.map((n) => n.acc);
    $: decel = $config.traj_planner.map((n) => n.decel);
    $: vel = $config.traj_planner.map((n) => n.vel);
    $: move_to = $config.traj_planner.map((n) => parseInt(n.move_to));

    let deplacements = [
        {
            acceleration: 10000,
            vitesse: 50000,
            deceleration: 10000,
            position: 3000,
            delai: 5000,
        },
        {
            acceleration: 10000,
            vitesse: 10000,
            deceleration: 10000,
            position: 80000,
            delai: 5000,
        },
        {
            acceleration: 10000,
            vitesse: 50000,
            deceleration: 10000,
            position: 3000,
            delai: 5000,
        },
    ];

    $: {
        // graph position en fonction du temps
        for (let i = 0; i < delay.length; i++) {
            let d_0 = i > 0 ? move_to[i - 1] : 0; // position initial

            // console.log(v_0, move_to[i], acc[i]);
            // let t_acc = Math.sqrt(2*(Math.abs(d_0 - move_to[i]) / acc[i]));
            
            let t_acc = Math.min(Math.sqrt(2*(Math.abs(d_0 - move_to[i]) / acc[i])), delay[i]);
            
            let y_acc = Math.min(move_to[i] * delay[i] + 0.5 * delay[i] * Math.pow(delay[i], 2), move_to[i]);//move_to[i];
            
            


            // velocity
            // si y_acc < move_to[i] :
            // pas atteint max donc t_vel = t_acc
            // si y_acc == move_to[i] :
            // alors y_vel = move_to[i] 
            // 
            let t_vel = t_acc;//y_acc < move_to[i] ? t_acc : 0; // 
            let y_vel = Math.min(y_acc, move_to[i]);

            // deceleration
            let t_decel = Math.sqrt(2*(Math.abs(d_0 - move_to[i]) / decel[i]));
            let y_decel = Math.min(move_to[i] * delay[i] + 0.5 * delay[i] * Math.pow(delay[i], 2), move_to[i]);


            // delay
            let t_delay = Math.max( Math.abs((delay[i]) - (t_acc + t_vel + t_decel)), 0);
            let y_delay = y_decel;
            
            console.log(t_acc);
            
            res_x.push( t_acc, t_decel);
            res_y.push( y_acc, y_decel);
        }
    }

    //              vel
    //        _______________
    //       /               \
    //  acc /                 \  dec
    //     /                   \
    //    /                     \___________
    //   |------------- delay --------------|

    // si délai inférieur au déplacement → override avec traj suivante

    // t_acc (s) = (vel_fin - vel_ini) / acc
    function sum(arr: Array<number>) {
        return arr.reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
        }, 0);
    }
    function sum_array(arr: Array<number>) {
        return arr.map((n, i) => arr.slice(0, i + 1).reduce((a, b) => a + b));
    }
</script>

<Dialog.Root
    {open}
    onOpenChange={(e) => {
        onClose();
        open = false;
    }}
>
    <Dialog.Content class="sm:max-w-[600px]">
        <Dialog.Header>
            <Dialog.Title class="flex items-center">
                <LineChart class="w-6 mr-2" />Position over time</Dialog.Title
            >
        </Dialog.Header>
        <div class="grid gap-4 py-4">
            <Chart type={Type.POINT} x_axis={sum_array(res_x)} y_axis={res_y} />
        </div>
    </Dialog.Content>
</Dialog.Root>
