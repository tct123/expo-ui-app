import {
  DatePicker,
  Form,
  Host,
  Picker,
  Section,
  Text,
  TextField,
  Toggle,
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
              modifiers={[listRowSeparator("hidden")]}
            />
            <TextField
              placeholder="Description"
              modifiers={[frame({ height: 80, alignment: "top" })]}
            />
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
            <Picker
              // modifiers={[pickerStyle("menu")]}
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
        </Form>
      </Host>
    </>
  );
}
