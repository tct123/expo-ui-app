// Ordering preferences — FieldGroup is SwiftUI's Form made universal:
// grouped rows, section titles, and footers on iOS, Android, and web.
import {
  FieldGroup,
  Host,
  Picker,
  Row,
  Slider,
  Spacer,
  Switch,
  Text,
} from "@expo/ui";

import { usePreferences } from "@/state/preferences";

const GRAY = "#8E8E93";

function LabeledRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Row alignment="center" spacing={16}>
      <Text>{label}</Text>
      <Spacer flexible />
      {children}
    </Row>
  );
}

export default function Preferences() {
  const {
    vegetarianOnly,
    setVegetarianOnly,
    hideSpicy,
    setHideSpicy,
    orderType,
    setOrderType,
    tip,
    setTip,
    orderUpdates,
    setOrderUpdates,
    promos,
    setPromos,
  } = usePreferences();

  return (
    <Host style={{ flex: 1 }}>
      <FieldGroup>
        <FieldGroup.Section title="Dietary">
          <LabeledRow label="Vegetarian only">
            <Switch value={vegetarianOnly} onValueChange={setVegetarianOnly} />
          </LabeledRow>
          <LabeledRow label="Hide spicy items">
            <Switch value={hideSpicy} onValueChange={setHideSpicy} />
          </LabeledRow>
          <FieldGroup.SectionFooter>
            <Text textStyle={{ fontSize: 13, color: GRAY }}>
              Filters apply to the menu instantly.
            </Text>
          </FieldGroup.SectionFooter>
        </FieldGroup.Section>

        <FieldGroup.Section title="Ordering">
          <LabeledRow label="Order type">
            <Picker selectedValue={orderType} onValueChange={setOrderType}>
              <Picker.Item label="Pickup" value="pickup" />
              <Picker.Item label="Delivery" value="delivery" />
              <Picker.Item label="Dine-in" value="dine-in" />
            </Picker>
          </LabeledRow>
          <LabeledRow label={`Tip · ${tip}%`}>
            <Slider
              value={tip}
              onValueChange={setTip}
              min={0}
              max={30}
              step={5}
            />
          </LabeledRow>
        </FieldGroup.Section>

        <FieldGroup.Section title="Notifications">
          <LabeledRow label="Order updates">
            <Switch value={orderUpdates} onValueChange={setOrderUpdates} />
          </LabeledRow>
          <LabeledRow label="Deals & promos">
            <Switch value={promos} onValueChange={setPromos} />
          </LabeledRow>
          <FieldGroup.SectionFooter>
            <Text textStyle={{ fontSize: 13, color: GRAY }}>
              We'll only ping you when your order changes status.
            </Text>
          </FieldGroup.SectionFooter>
        </FieldGroup.Section>
      </FieldGroup>
    </Host>
  );
}
