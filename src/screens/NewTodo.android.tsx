import ChevronRight from "@expo/material-symbols/chevron_right.xml";
import {
  Column,
  Host,
  Icon,
  LazyColumn,
  ListItem,
  RadioButton,
  RNHostView,
  Switch,
  Text,
  TextField,
  useNativeState,
} from "@expo/ui/jetpack-compose";
import {
  clickable,
  clip,
  fillMaxWidth,
  padding,
  Shapes,
} from "@expo/ui/jetpack-compose/modifiers";
import { ReactNode, useCallback, useState } from "react";
import { TextInput } from "react-native";
import { useColors } from "../theme/ThemeContext";
import { formatPhone } from "../utils/formatPhone";

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const { background, text, secondaryText } = useColors();
  return (
    <>
      <Text color={text} style={{ typography: "labelLarge" }} modifiers={[]}>
        {title}
      </Text>
      <Column verticalArrangement={{ spacedBy: 2 }}>{children}</Column>
    </>
  );
}

function SettingsActionRow({
  label,
  onPress,
  position,
  tint,
  icon = ChevronRight,
  typography = "titleMedium",
}: {
  label: string;
  onPress: () => void;
  position?: CornerPosition;
  tint?: string;
  icon?: number;
  typography?: "titleMedium" | "labelSmall";
}) {
  const { secondaryBackground } = useColors();
  return (
    <ListItem
      colors={{
        containerColor: secondaryBackground,
      }}
      modifiers={[
        clip(Shapes.RoundedCorner(cornerRadii(16, position))),
        clickable(onPress),
      ]}
    >
      <ListItem.HeadlineContent>
        <Text color={tint} style={{ typography }}>
          {label}
        </Text>
      </ListItem.HeadlineContent>
      <ListItem.TrailingContent>
        <Icon
          source={icon}
          size={20}
        // tint={systemColors.secondaryText}
        />
      </ListItem.TrailingContent>
    </ListItem>
  );
}

export default function NewTodo() {
  const { secondaryBackground } = useColors();
  const text = useNativeState("");
  const selection = useNativeState({ start: 0, end: 0 });

  const [stateText, setStateText] = useState("");

  const handleValueChange = useCallback(
    (v: string) => {
      "worklet";
      const formatted = formatPhone(v);
      if (formatted !== v) {
        text.value = formatted;
        // Snaps to end for demo. Real masks need smarter cursor handling.
        selection.value = { start: formatted.length, end: formatted.length };
      }
    },
    [text, selection],
  );

  return (
    <Host style={{ flex: 1 }}>
      <LazyColumn
        verticalArrangement={{ spacedBy: 8 }}
        contentPadding={{
          start: 16,
          end: 16,
          top: 16,
        }}
      >
        <SettingsSection title="hello">
          <Column
            verticalArrangement={{
              spacedBy: 8,
            }}
          >
            <RNHostView matchContents>
              <TextInput
                placeholder="RN input"
                value={stateText}
                onChangeText={(text) => {
                  const formatted = formatPhone(text);
                  setStateText(formatted);
                }}
                keyboardType="numeric"
                style={{
                  borderWidth: 1,
                  padding: 10,
                  width: "90%",
                  height: 50,
                }}
              />
            </RNHostView>
            <TextField
              value={text}
              selection={selection}
              onValueChange={handleValueChange}
              onSelectionChange={(selection) => {
                console.log([selection.start, selection.end]);
              }}
              modifiers={[fillMaxWidth(), padding(0, 0, 0, 16)]}
              keyboardOptions={{ keyboardType: "number" }}
            >
              <TextField.LeadingIcon>
                <Icon source={ChevronRight} />
              </TextField.LeadingIcon>
              <TextField.Label>
                <Text>Username</Text>
              </TextField.Label>
              <TextField.Placeholder>
                <Text>Hello world</Text>
              </TextField.Placeholder>
            </TextField>
          </Column>

          <SettingsActionRow
            label="world"
            onPress={() => { }}
            position="leading"
          />
          <SettingsActionRow
            label="world"
            onPress={() => { }}
            position="trailing"
          />
        </SettingsSection>

        <SettingsSection title="part 2">
          <SettingsActionRow
            label="hello"
            onPress={() => { }}
            position="leading"
          />
          <SettingsActionRow
            label="jetpack"
            onPress={() => { }}
            position="trailing"
          />
        </SettingsSection>

        <SettingsSection title="Devs">
          <ListItem
            modifiers={[clip(Shapes.RoundedCorner(cornerRadii(16, "leading")))]}
            colors={{
              containerColor: secondaryBackground,
            }}
          >
            <ListItem.HeadlineContent>
              <Text style={{ typography: "titleMedium" }}>toggle</Text>
            </ListItem.HeadlineContent>

            <ListItem.SupportingContent>
              <Text style={{ typography: "bodySmall" }}>this is a toggle</Text>
            </ListItem.SupportingContent>

            <ListItem.TrailingContent>
              <Switch
                value={false}
                onCheckedChange={(value) => console.log(value)}
              />
            </ListItem.TrailingContent>
          </ListItem>

          <ListItem
            modifiers={[
              clip(Shapes.RoundedCorner(cornerRadii(16, "trailing"))),
            ]}
            colors={{
              containerColor: secondaryBackground,
            }}
          >
            <ListItem.HeadlineContent>
              <Text style={{ typography: "titleMedium" }}>toggle 2</Text>
            </ListItem.HeadlineContent>

            <ListItem.TrailingContent>
              <RadioButton selected={true} onClick={() => { }} />
            </ListItem.TrailingContent>
          </ListItem>
        </SettingsSection>
      </LazyColumn>
    </Host>
  );
}

type CornerPosition = "leading" | "trailing" | "single";

function cornerRadii(radius: number, position?: CornerPosition) {
  const inner = Math.min(radius > 0 ? 4 : 0, radius);
  switch (position) {
    case "single":
      return {
        topStart: radius,
        topEnd: radius,
        bottomStart: radius,
        bottomEnd: radius,
      };
    case "leading":
      return {
        topStart: radius,
        topEnd: radius,
        bottomStart: inner,
        bottomEnd: inner,
      };
    case "trailing":
      return {
        topStart: inner,
        topEnd: inner,
        bottomStart: radius,
        bottomEnd: radius,
      };
    default:
      return {
        topStart: inner,
        topEnd: inner,
        bottomStart: inner,
        bottomEnd: inner,
      };
  }
}
