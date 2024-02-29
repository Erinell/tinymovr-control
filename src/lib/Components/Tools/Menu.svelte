<script lang="ts">
  import {
    Upload,
    Plus,
    Trash2,
    FileJson2,
    ScanText,
    LineChart,
    File,
    View,
    Pencil,
    Waypoints,
    Home,
    X,
    RotateCcw,
    FileTerminal,
  } from "lucide-svelte";
  import { Label, Menubar } from "$lib";
  import { addMessages, init, _ } from "svelte-i18n";
  import { langs } from "$lib/lang";
  import {
    device,
    config,
    editable_sections,
    remove_sections,
    defaultConfig,
    current_lang,
  } from "$lib/store";
  import AddChart from "$lib/Components/Dialogs/AddChart.svelte";
  import EditCharts from "$lib/Components/Dialogs/EditCharts.svelte";
  import ConfirmAction from "$lib/Components/Dialogs/ConfirmAction.svelte";
  import SharePlainText from "$lib/Components/Dialogs/SharePlainText.svelte";
  import ShareDiscord from "$lib/Components/Dialogs/ShareDiscord.svelte";
  import Macros from "$lib/Components/Dialogs/Macros.svelte";
  import Homing from "$lib/Components/Dialogs/Homing.svelte";
  import TrajectoryPlanner from "$lib/Components/Dialogs/TrajectoryPlanner/TrajectoryPlanner.svelte";
  import { toastsStore } from "$lib/Components/ui/toast";
  import AddSection from "$lib/Components/Dialogs/AddSection.svelte";
  import { isConfig } from "$lib/utils";

  langs.forEach((lang) => {
    addMessages(lang.id, lang.translation);
  });

  updateLang($current_lang);
  function updateLang(lang: string | undefined) {
    init({
      initialLocale: lang,
      fallbackLocale: "",
    });
  }

  function sortJSON(obj: any) {
    const sortedKeys = Object.keys(obj).sort();
    const sortedObject: any = {};

    sortedKeys.forEach((key) => {
      sortedObject[key] = obj[key];
    });

    return sortedObject;
  }

  function exportJSON(type: string) {
    if (!["data", "config"].includes(type))
      return toastsStore.error(`Unable to export JSON from ${type}`);
    if (!$device && type === "data")
      return toastsStore.error($_("error-connected-data"));
    var a = document.createElement("a");
    document.body.append(a);
    a.download = type;
    a.href = URL.createObjectURL(
      new Blob(
        [
          JSON.stringify(
            type === "data" && $device ? sortJSON($device.data) : $config,
            null,
            2,
          ),
        ],
        {
          type: "application/json",
        },
      ),
    );
    a.click();
    a.remove();
  }

  let files: any;
  $: if (files) importConfig();
  async function importConfig() {
    const importedConfig = JSON.parse(await files[0].text());
    if (!isConfig(importedConfig))
      return toastsStore.error($_("not-valid-config"));
    $config = importedConfig;
  }

  let add_chart = false;
  let edit_charts = false;
  let share_plain_text = false;
  let confirm_delete_all = false;
  let share_discord = false;
  let homing = false;
  let trajectory_planner = false;
  let add_section = false;
  let macros = false;
</script>

<AddSection open={add_section} onClose={() => (add_section = false)}
></AddSection>
<AddChart open={add_chart} onClose={() => (add_chart = false)} />
<EditCharts open={edit_charts} onClose={() => (edit_charts = false)} />
<SharePlainText
  open={share_plain_text}
  onClose={() => (share_plain_text = false)}
/>
<ShareDiscord open={share_discord} onClose={() => (share_discord = false)} />
<Homing open={homing} onClose={() => (homing = false)} />
<TrajectoryPlanner
  open={trajectory_planner}
  onClose={() => (trajectory_planner = false)}
/>
<Macros open={macros} onClose={() => (macros = false)} />

<ConfirmAction
  open={confirm_delete_all}
  onClose={() => (confirm_delete_all = false)}
  onValid={() => (($config.charts = []), (confirm_delete_all = false))}
>
  {$_("remove-charts-confirm")}
</ConfirmAction>

<Menubar.Root>
  <Menubar.Menu>
    <Menubar.Trigger
      ><File class="w-4 h-4 mr-1 m-0" />{$_("file")}</Menubar.Trigger
    >
    <Menubar.Content>
      <Menubar.Item on:click={() => exportJSON("data")}
        ><FileJson2 class="w-5 mr-2" />{$_("export-json-data")}</Menubar.Item
      >
      <Menubar.Item on:click={() => exportJSON("config")}
        ><FileJson2 class="w-5 mr-2" />{$_("export-json-config")}</Menubar.Item
      >
      <input
        type="file"
        name="file"
        id="file"
        class="hidden-file-button"
        bind:files
        accept="application/JSON"
      />
      <div
        class="select-none cursor-pointer rounded-sm px-2 py-1 hover:bg-accent"
      >
        <Label for="file" class="font-normal cursor-pointer">
          <Upload class="w-5 mr-1 inline" />
          {$_("import-config")}
        </Label>
      </div>
      <Menubar.Separator />
      <Menubar.Sub>
        <Menubar.SubTrigger>{$_("share")}</Menubar.SubTrigger>
        <Menubar.SubContent>
          <Menubar.Item
            on:click={() => {
              share_plain_text = true;
            }}
          >
            <ScanText class="w-5 mr-2" />{$_("plain-text")}
          </Menubar.Item>
          <Menubar.Item
            on:click={() => {
              share_discord = true;
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              class="bi bi-discord mr-2 w-5"
              viewBox="0 0 16 16"
            >
              <path
                d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"
              />
            </svg>
            Discord
          </Menubar.Item>
        </Menubar.SubContent>
      </Menubar.Sub>
    </Menubar.Content>
  </Menubar.Menu>

  <Menubar.Menu>
    <Menubar.Trigger>
      <LineChart class="w-4 h-4 mr-1" />{$_("chart")}
    </Menubar.Trigger>
    <Menubar.Content>
      <Menubar.Item on:click={() => (add_chart = true)}>
        <Plus class="w-5 mr-2" />
        {$_("add")}
      </Menubar.Item>
      <Menubar.Item
        on:click={() => {
          edit_charts = true;
        }}
      >
        <Pencil class="w-5 mr-2" />
        {$_("edit")}
      </Menubar.Item>
      <Menubar.Separator />
      <Menubar.Item
        class="text-destructive"
        on:click={() => {
          confirm_delete_all = true;
        }}
      >
        <Trash2 class="w-5 mr-2" />
        {$_("remove-all")}
      </Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>
  <Menubar.Menu>
    <Menubar.Trigger>
      <View class="w-4 h-4 mr-1" />{$_("view")}
    </Menubar.Trigger>
    <Menubar.Content>
      <Menubar.CheckboxItem bind:checked={$config.showTitles}>
        {$_("show_titles")}
      </Menubar.CheckboxItem>
      <Menubar.Sub>
        <Menubar.SubTrigger>{$_("sections")}</Menubar.SubTrigger>
        <Menubar.SubContent>
          <Menubar.Item on:click={() => (add_section = true)}>
            <Plus class="w-5 mr-2" />{$_("add")}
          </Menubar.Item>
          <Menubar.Separator />
          <Menubar.CheckboxItem
            bind:checked={$editable_sections}
            onCheckedChange={(checked) => {
              if (checked) $remove_sections = false;
            }}
          >
            <Pencil class="w-5 mr-2" />{$_("edit")}
          </Menubar.CheckboxItem>
          <Menubar.CheckboxItem
            bind:checked={$remove_sections}
            onCheckedChange={(checked) => {
              if (checked) $editable_sections = false;
            }}
          >
            <X class="w-5 mr-2" />{$_("remove")}
          </Menubar.CheckboxItem>
          <Menubar.Separator />
          <Menubar.Item
            class="text-destructive"
            on:click={() => {
              // TODO: not reset every time, need refresh page...
              $config.sections = $defaultConfig.sections;
            }}
          >
            <RotateCcw class="w-5 mr-2" />
            {$_("reset-all")}
          </Menubar.Item>
        </Menubar.SubContent>
      </Menubar.Sub>
      <Menubar.Sub>
        <Menubar.SubTrigger>{$_("language")}</Menubar.SubTrigger>
        <Menubar.SubContent>
          <Menubar.RadioGroup bind:value={$current_lang} onValueChange={(value)=> updateLang(value)}>
            {#each langs as lang}
              <Menubar.RadioItem value={lang.id}>{lang.label}</Menubar.RadioItem
              >
            {/each}
          </Menubar.RadioGroup>
        </Menubar.SubContent>
      </Menubar.Sub>
    </Menubar.Content>
  </Menubar.Menu>
  <Menubar.Menu>
    <Menubar.Trigger>
      <FileTerminal class="w-4 h-4 mr-1" />{$_("macros")}
    </Menubar.Trigger>
    <Menubar.Content>
      <Menubar.Item on:click={() => (macros = true)}>
        <Pencil class="w-5 mr-2" />{$_("edit")}
      </Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>
  {#if $device}
    <Menubar.Menu>
      <Menubar.Trigger>
        <Home class="w-4 h-4 mr-1" />{$_("homing")}
      </Menubar.Trigger>
      <Menubar.Content>
        <Menubar.Item
          on:click={() => {
            homing = true;
          }}>WIP</Menubar.Item
        >
      </Menubar.Content>
    </Menubar.Menu>
    <Menubar.Menu>
      <Menubar.Trigger>
        <Waypoints class="w-4 h-4 mr-1" />{$_("trajectory-planner")}
      </Menubar.Trigger>
      <Menubar.Content>
        <Menubar.Item on:click={() => (trajectory_planner = true)}>
          <Pencil class="w-5 mr-2" />{$_("edit")}
        </Menubar.Item>
      </Menubar.Content>
    </Menubar.Menu>
  {/if}
</Menubar.Root>
