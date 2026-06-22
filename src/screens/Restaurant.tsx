// Beto's Tacos — a realistic ordering screen built entirely with the
// universal components in @expo/ui.
//
// Component checklist (with src/screens/Preferences.tsx):
//   Host, Column, Row, Spacer, ScrollView (horizontal chips + sheet content),
//   Text, Icon (+ Icon.select), Button (all 3 variants), Switch, Checkbox,
//   Slider, TextInput (+ useNativeState), Picker (+ Picker.Item),
//   BottomSheet, Collapsible, List, ListItem (all 3 slots), RNHostView,
//   and FieldGroup (+ Section / SectionFooter) on the Preferences screen.
import {
  BottomSheet,
  Button,
  Checkbox,
  Collapsible,
  Column,
  Host,
  Icon,
  List,
  ListItem,
  Picker,
  RNHostView,
  Row,
  ScrollView,
  Slider,
  Spacer,
  Switch,
  Text,
  TextInput,
  useNativeState,
} from "@expo/ui";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text as RNText, View } from "react-native";
import { usePreferences } from "../state/preferences";

const BRAND = "#E8590C";
const GRAY = "#8E8E93";

const STAR = Icon.select({
  ios: "star.fill",
  android: import("@expo/material-symbols/star.xml"),
});
const CHEVRON = Icon.select({
  ios: "chevron.right",
  android: import("@expo/material-symbols/chevron_right.xml"),
});
const FLAME = Icon.select({
  ios: "flame.fill",
  android: import("@expo/material-symbols/local_fire_department.xml"),
});
const LEAF = Icon.select({
  ios: "leaf.fill",
  android: import("@expo/material-symbols/eco.xml"),
});
const GEAR = Icon.select({
  ios: "gearshape.fill",
  android: import("@expo/material-symbols/settings.xml"),
});
const CART = Icon.select({
  ios: "cart.fill",
  android: import("@expo/material-symbols/shopping_cart.xml"),
});
const CLOCK = Icon.select({
  ios: "clock",
  android: import("@expo/material-symbols/schedule.xml"),
});

type Category = "Tacos" | "Burritos" | "Sides" | "Drinks";

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  emoji: string;
  category: Category;
  spicy?: boolean;
  vegetarian?: boolean;
};

const CATEGORIES = ["All", "Tacos", "Burritos", "Sides", "Drinks"] as const;

const MENU: MenuItem[] = [
  // prettier-ignore
  { id: 1, name: "Al Pastor", description: "Marinated pork, pineapple, cilantro, onion", price: 3.5, emoji: "🌮", category: "Tacos", spicy: true },
  // prettier-ignore
  { id: 2, name: "Carne Asada", description: "Grilled steak, salsa cruda, lime", price: 3.95, emoji: "🌮", category: "Tacos" },
  // prettier-ignore
  { id: 3, name: "Baja Fish", description: "Beer-battered fish, cabbage slaw, chipotle crema", price: 4.25, emoji: "🐟", category: "Tacos", spicy: true },
  // prettier-ignore
  { id: 4, name: "Rajas con Queso", description: "Roasted poblanos, melted cheese, crema", price: 3.25, emoji: "🫑", category: "Tacos", vegetarian: true },
  // prettier-ignore
  { id: 5, name: "Burrito California", description: "Carne asada, fries, guac, pico de gallo", price: 11.5, emoji: "🌯", category: "Burritos" },
  // prettier-ignore
  { id: 6, name: "Burrito Vegetariano", description: "Beans, rice, grilled veggies, queso fresco", price: 9.75, emoji: "🌯", category: "Burritos", vegetarian: true },
  // prettier-ignore
  { id: 7, name: "Chips & Guacamole", description: "Hand-smashed guac, warm tortilla chips", price: 6.5, emoji: "🥑", category: "Sides", vegetarian: true },
  // prettier-ignore
  { id: 8, name: "Elote", description: "Street corn, mayo, cotija, tajín", price: 4.75, emoji: "🌽", category: "Sides", vegetarian: true, spicy: true },
  // prettier-ignore
  { id: 9, name: "Horchata", description: "House-made, cinnamon rice milk", price: 3.5, emoji: "🥛", category: "Drinks", vegetarian: true },
  // prettier-ignore
  { id: 10, name: "Agua de Jamaica", description: "Hibiscus iced tea, lightly sweetened", price: 3.25, emoji: "🌺", category: "Drinks", vegetarian: true },
];

const SPICE_LABELS = ["Mild", "Medium", "Hot", "Diablo 🔥"];
const GUAC_PRICE = 1.5;
const CHEESE_PRICE = 1.0;
const COMBO_PRICE = 4.0;

// The bread and butter of native-feeling rows: label, flexible spacer, control.
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

export default function Restaurant() {
  const router = useRouter();
  const { vegetarianOnly, hideSpicy, orderType, tip } = usePreferences();

  // --- Menu state ---
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [items, setItems] = useState(MENU);
  const [cart, setCart] = useState({ count: 0, total: 0 });

  // --- Customization sheet state ---
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const [tortilla, setTortilla] = useState("corn");
  const [quantity, setQuantity] = useState(1);
  const [spice, setSpice] = useState(1);
  const [guac, setGuac] = useState(false);
  const [cheese, setCheese] = useState(false);
  const [combo, setCombo] = useState(false);
  const [allergensOpen, setAllergensOpen] = useState(false);
  // Native state: typing never re-renders this component.
  const notes = useNativeState("");

  const filteredItems = items.filter(
    (item) =>
      (category === "All" || item.category === category) &&
      (!vegetarianOnly || item.vegetarian) &&
      (!hideSpicy || !item.spicy),
  );

  const extrasTotal =
    (guac ? GUAC_PRICE : 0) +
    (cheese ? CHEESE_PRICE : 0) +
    (combo ? COMBO_PRICE : 0);
  const sheetTotal = ((selected?.price ?? 0) + extrasTotal) * quantity;

  function openItem(item: MenuItem) {
    setSelected(item);
    setTortilla("corn");
    setQuantity(1);
    setSpice(1);
    setGuac(false);
    setCheese(false);
    setCombo(false);
    setAllergensOpen(false);
    notes.value = "";
  }

  function addToOrder() {
    setCart((current) => ({
      count: current.count + quantity,
      total: current.total + sheetTotal,
    }));
    console.log("Added to order:", selected?.name, {
      tortilla,
      quantity,
      spice: SPICE_LABELS[Math.round(spice)],
      guac,
      cheese,
      combo,
      notes: notes.value,
    });
    setSelected(null);
  }

  async function handleRefresh() {
    // The native spinner stays visible until this promise resolves.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setItems((current) =>
      current.some((item) => item.id === 11)
        ? current
        : [
          // prettier-ignore
          { id: 11, name: "Birria (Today's Special)", description: "Slow-braised beef, consommé for dipping", price: 4.95, emoji: "🍲", category: "Tacos" as const, spicy: true },
          ...current,
        ],
    );
  }

  return (
    // `seedColor={BRAND}` lands in a newer @expo/ui — it themes the whole
    // subtree (Material You palette on Android, SwiftUI tint on iOS).
    <Host style={{ flex: 1 }}>
      <Column>
        {/* ---------- Header ---------- */}
        <Column spacing={12} style={{ padding: 16, paddingBottom: 8 }}>
          <Row spacing={12} alignment="center">
            {/* RNHostView: a React Native view embedded back inside the native tree. */}
            <RNHostView matchContents>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  backgroundColor: "#FFF3E0",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <RNText style={{ fontSize: 30 }}>🌮</RNText>
              </View>
            </RNHostView>
            <Column spacing={2}>
              <Text textStyle={{ fontSize: 22, fontWeight: "bold" }}>
                Beto's Tacos
              </Text>
              <Row spacing={4} alignment="center">
                <Icon name={STAR} size={13} color="#FFB400" />
                <Text textStyle={{ fontSize: 13, color: GRAY }}>
                  4.8 (1.2k) ·
                </Text>
                <Icon name={CLOCK} size={13} color={GRAY} />
                <Text textStyle={{ fontSize: 13, color: GRAY }}>20–30 min</Text>
              </Row>
            </Column>
            <Spacer flexible />
            <Icon
              name={GEAR}
              size={22}
              color={GRAY}
              onPress={() => router.push("/preferences")}
            />
          </Row>

          {/* Category chips: a horizontal ScrollView of Buttons. */}
          <ScrollView direction="horizontal" showsIndicators={true}>
            <Row spacing={8}>
              {CATEGORIES.map((c) => (
                <Button
                  key={c}
                  label={c}
                  variant={category === c ? "filled" : "outlined"}
                  onPress={() => setCategory(c)}
                />
              ))}
            </Row>
          </ScrollView>

          {/* Order banner, only when the cart has items. */}
          {cart.count > 0 && (
            <Row
              alignment="center"
              spacing={8}
              onPress={() =>
                alert(
                  `Order: ${cart.count} item(s) — $${cart.total.toFixed(2)}\n` +
                  `${orderType} · ${tip}% tip`,
                )
              }
              style={{
                padding: 12,
                borderRadius: 12,
                backgroundColor: "#FFF3E0",
              }}
            >
              <Icon name={CART} size={16} color={BRAND} />
              <Text textStyle={{ fontSize: 15, color: "#7C2D12" }}>
                {`${cart.count} item${cart.count === 1 ? "" : "s"} in your order`}
              </Text>
              <Spacer flexible />
              <Text
                textStyle={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: "#7C2D12",
                }}
              >
                {`$${cart.total.toFixed(2)}`}
              </Text>
              <Icon name={CHEVRON} size={12} color="#7C2D12" />
            </Row>
          )}
        </Column>

        <List onRefresh={handleRefresh}>
          {filteredItems.map((item) => (
            <ListItem
              key={item.id}
              onPress={() => openItem(item)}
              leading={<Text textStyle={{ fontSize: 24 }}>{item.emoji}</Text>}
              supportingText={item.description}
              trailing={
                <Row spacing={6} alignment="center">
                  {item.spicy && (
                    <Icon name={FLAME} size={14} color="#FF3B30" />
                  )}
                  {item.vegetarian && (
                    <Icon name={LEAF} size={14} color="#34C759" />
                  )}
                  <Text textStyle={{ fontSize: 15, fontWeight: "600" }}>
                    {`$${item.price.toFixed(2)}`}
                  </Text>
                  <Icon name={CHEVRON} size={12} color={GRAY} />
                </Row>
              }
            >
              {item.name}
            </ListItem>
          ))}
        </List>
      </Column>

      {/* ---------- Item customization sheet ---------- */}
      <BottomSheet
        isPresented={selected !== null}
        onDismiss={() => setSelected(null)}
        snapPoints={["half", "full"]}
      >
        {selected && (
          <ScrollView>
            <Column spacing={20} style={{ padding: 16 }}>
              <Row spacing={12} alignment="center">
                <Text textStyle={{ fontSize: 34 }}>{selected.emoji}</Text>
                <Column spacing={2}>
                  <Text textStyle={{ fontSize: 20, fontWeight: "bold" }}>
                    {selected.name}
                  </Text>
                  <Text
                    textStyle={{ fontSize: 13, color: GRAY }}
                    numberOfLines={2}
                  >
                    {selected.description}
                  </Text>
                </Column>
              </Row>

              {selected.category === "Tacos" && (
                <LabeledRow label="Tortilla">
                  <Picker selectedValue={tortilla} onValueChange={setTortilla}>
                    <Picker.Item label="Corn" value="corn" />
                    <Picker.Item label="Flour" value="flour" />
                    <Picker.Item label="Crispy" value="crispy" />
                  </Picker>
                </LabeledRow>
              )}

              <Row alignment="center" spacing={12}>
                <Text textStyle={{ fontWeight: "600" }}>Quantity</Text>
                <Spacer flexible />
                <Button
                  variant="outlined"
                  label="−"
                  disabled={quantity <= 1}
                  onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                />
                <Text textStyle={{ fontSize: 17, fontWeight: "600" }}>
                  {`${quantity}`}
                </Text>
                <Button
                  variant="outlined"
                  label="+"
                  onPress={() => setQuantity((q) => q + 1)}
                />
              </Row>

              <Column spacing={6}>
                <Row alignment="center">
                  <Text textStyle={{ fontWeight: "600" }}>Spice level</Text>
                  <Spacer flexible />
                  <Text textStyle={{ color: GRAY }}>
                    {SPICE_LABELS[Math.round(spice)]}
                  </Text>
                </Row>
                <Slider
                  value={spice}
                  onValueChange={setSpice}
                  min={0}
                  max={3}
                  step={1}
                />
              </Column>

              <Column spacing={8}>
                <Text textStyle={{ fontWeight: "600" }}>Extras</Text>
                <Checkbox
                  label={`Guacamole (+$${GUAC_PRICE.toFixed(2)})`}
                  value={guac}
                  onValueChange={setGuac}
                />
                <Checkbox
                  label={`Extra cheese (+$${CHEESE_PRICE.toFixed(2)})`}
                  value={cheese}
                  onValueChange={setCheese}
                />
                <Switch
                  label={`Make it a combo — chips & drink (+$${COMBO_PRICE.toFixed(2)})`}
                  value={combo}
                  onValueChange={setCombo}
                />
              </Column>

              <Column spacing={6}>
                <Text textStyle={{ fontWeight: "600" }}>
                  Special instructions
                </Text>
                <TextInput
                  value={notes}
                  placeholder="No onions, extra salsa verde..."
                  multiline
                  numberOfLines={3}
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    backgroundColor: "#F2F2F7",
                  }}
                  textStyle={{ color: "#1C1C1E" }}
                />
              </Column>

              <Collapsible
                isOpen={allergensOpen}
                onOpenChange={setAllergensOpen}
                label="Allergens & nutrition"
                labelStyle={{ fontWeight: "600" }}
              >
                <Column spacing={4} style={{ paddingVertical: 8 }}>
                  <Text textStyle={{ fontSize: 13, color: GRAY }}>
                    Contains: dairy, gluten (flour tortilla only).
                  </Text>
                  <Text textStyle={{ fontSize: 13, color: GRAY }}>
                    Around 450 cal per serving before extras.
                  </Text>
                </Column>
              </Collapsible>

              <Column spacing={8}>
                <Button
                  variant="filled"
                  label={`Add ${quantity} to order — $${sheetTotal.toFixed(2)}`}
                  onPress={addToOrder}
                />
                <Button
                  variant="text"
                  label="Cancel"
                  onPress={() => setSelected(null)}
                />
              </Column>
            </Column>
          </ScrollView>
        )}
      </BottomSheet>
    </Host>
  );
}
