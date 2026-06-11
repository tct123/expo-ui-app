import {
  Button,
  ColorPicker,
  DatePicker,
  Form,
  Host,
  Picker,
  Section,
  Text,
  TextField,
  Toggle,
  useNativeState,
} from "@expo/ui/swift-ui";
import {
  frame,
  listRowSeparator,
  listSectionSpacing,
  scrollDismissesKeyboard,
  tag,
} from "@expo/ui/swift-ui/modifiers";
import { Stack } from "expo-router";
import { useState } from "react";

const tags = ["None", "Work", "Home", "Leisure", "Other"];

export default function NewTodo() {
  const [selectedTag, setSelectedTag] = useState("None");
  const text = useNativeState("");
  const selection = useNativeState({ start: 0, end: 0 });

  function onSubmit() {
    console.log("text: ", text.value);
  }
  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button disabled>Save</Stack.Toolbar.Button>
      </Stack.Toolbar>

      <Host style={{ flex: 1 }}>
        <Form
          modifiers={[
            listSectionSpacing("compact"),
            scrollDismissesKeyboard("interactively"),
          ]}
        >
          <Section title="Task">
            <TextField
              placeholder="Title"
              autoFocus
              text={text}
              selection={selection}
              onSelectionChange={(selection) => {
                console.log(selection);
              }}
              modifiers={[listRowSeparator("hidden")]}
            />
            <TextField
              placeholder="Description"
              modifiers={[frame({ height: 80, alignment: "top" })]}
            />
            <Button onPress={onSubmit}>
              <Text>submit</Text>
            </Button>
          </Section>

          <DatePicker
            title="Date"
            displayedComponents={["hourAndMinute", "date"]}
            modifiers={[listRowSeparator("hidden")]}
          />

          <Toggle label="Alert" />

          <Section
            footer={
              <Text>The selected priority will be used for notifications.</Text>
            }
          >
            {/* Pickers can be nested */}
            <Picker
              label="Priority"
              selection={selectedTag}
              onSelectionChange={setSelectedTag}
            >
              {tags.map((item, index) => (
                <Text key={index} modifiers={[tag(String(item))]}>
                  {item}
                </Text>
              ))}
            </Picker>
          </Section>

          <ColorPicker label="Tint Color" selection={"#007AFF"} />
        </Form>
      </Host>
    </>
  );
}
