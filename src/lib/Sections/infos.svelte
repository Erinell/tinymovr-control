<script>
  import { Button, Card } from "$lib/index";
  import { _ } from "svelte-i18n";
  import { Target } from "lucide-svelte";
  import { device, config } from "$lib/store";
</script>

<Card.Root class="w-full h-full overflow-hidden">
  {#if $config.showTitles}
    <Card.Header class="pb-0">
      <Card.Title>Informations</Card.Title>
    </Card.Header>
  {/if}
  <Card.Content class="flex flex-col">
    <Card.Root class="flex w-full justify-evenly overflow-hidden mb-2">
      <Card.Content>
        <h4>UID</h4>
        <h3 class="text-primary tracking-wide">
          {$device?.data["uid"] ?? "-"}
        </h3>
      </Card.Content>
      <Card.Content>
        <h4>Hash</h4>
        <h3 class="text-primary tracking-wide">
          {$device?.data["protocol_hash"] ?? "-"}
        </h3>
      </Card.Content>
      <Card.Content>
        <div class="flex gap-4">
          <h4>calibrated</h4>
          <Button class="w-8 h-8" size="icon" variant="outline"
          on:click={() => {
            // TODO: demander confirmation
            $device?.send("controller.calibrate");
          }}
          >
            <Target class="w-5 h-5" />
          </Button>
        </div>
        <h3 class="text-primary tracking-wide">
          {$device?.data["calibrated"] ?? "-"}
        </h3>
      </Card.Content>
      <Card.Content>
        <h4>Error</h4>
        <h3 class="text-primary tracking-wide">
          {$device?.data["errors"] ?? "-"}
        </h3>
      </Card.Content>
      <Card.Content>
        <h4>State</h4>
        <h3 class="text-primary tracking-wide">
          {$device?.data["controller.state"] ?? "-"}
        </h3>
      </Card.Content>
      <Card.Content>
        <h4>Mode</h4>
        <h3 class="text-primary tracking-wide">
          {$device?.data["controller.mode"] ?? "-"}
        </h3>
      </Card.Content>
    </Card.Root>
    <div class="flex">
      <Card.Root class="w-1/4 mr-2">
        <Card.Content>
          <h4>Vbus</h4>
          <h3 class="text-primary">
            <strong class="tracking-wide"
              >{$device?.data["Vbus"] ?? "00.00"}</strong
            > V
          </h3>
        </Card.Content>
      </Card.Root>
      <Card.Root class="w-1/4 mr-2">
        <Card.Content>
          <h4>Temp</h4>
          <h3 class="text-primary">
            <strong class="tracking-wide"
              >{$device?.data["temp"] ?? "00.00"}</strong
            > °C
          </h3>
        </Card.Content>
      </Card.Root>
      <Card.Root class="w-1/4 mr-2">
        <Card.Content>
          <h4>Ibus</h4>
          <h3 class="text-primary">
            <strong class="tracking-wide"
              >{$device?.data["Ibus"] ?? "00.00"}</strong
            > A
          </h3>
        </Card.Content>
      </Card.Root>
      <Card.Root class="w-1/4">
        <Card.Content>
          <h4>Power</h4>
          <h3 class="text-primary">
            <strong class="tracking-wide"
              >{$device?.data["power"] ?? "00.00"}</strong
            > W
          </h3>
        </Card.Content>
      </Card.Root>
    </div>
  </Card.Content>
</Card.Root>
