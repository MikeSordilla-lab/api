import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { colors, spacing, radius, font, shadow } from "../theme/bootstrap";

export default function StudentCard({ item, onEdit, onDelete }) {
  const handleDelete = () => {
    Alert.alert(
      "Delete Student",
      `Delete ${item.firstname} ${item.lastname}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(item.id),
        },
      ],
    );
  };

  return (
    <View style={styles.card}>
      {/* Card body */}
      <View style={styles.cardBody}>
        <Text style={styles.name}>
          {item.firstname} {item.lastname}
        </Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Rating: {item.ratings}</Text>
          </View>
        </View>
      </View>

      {/* Card footer — action buttons */}
      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={[styles.btn, styles.btnWarning]}
          onPress={() => onEdit(item)}
          activeOpacity={0.8}
        >
          <Text style={styles.btnWarningText}>✎ Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnDanger]}
          onPress={handleDelete}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>✕ Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing[3],
    // iOS shadow
    shadowColor: shadow.color,
    shadowOffset: shadow.offset,
    shadowOpacity: shadow.opacity,
    shadowRadius: shadow.radius,
    // Android shadow
    elevation: shadow.elevation,
  },
  cardBody: {
    padding: spacing[3],
  },
  name: {
    fontSize: font.h5,
    fontWeight: font.weightBold,
    color: colors.text,
    marginBottom: spacing[1],
  },
  badgeRow: {
    flexDirection: "row",
    marginTop: spacing[1],
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 2,
    paddingHorizontal: spacing[2],
  },
  badgeText: {
    color: colors.white,
    fontSize: font.sm,
    fontWeight: font.weightMedium,
  },
  cardFooter: {
    flexDirection: "row",
    gap: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bodyBg,
    borderBottomLeftRadius: radius.card,
    borderBottomRightRadius: radius.card,
  },
  btn: {
    flex: 1,
    paddingVertical: spacing[2] - 2,
    paddingHorizontal: spacing[2],
    borderRadius: radius.base,
    alignItems: "center",
    justifyContent: "center",
  },
  btnWarning: {
    backgroundColor: colors.warning,
  },
  btnDanger: {
    backgroundColor: colors.danger,
  },
  btnText: {
    color: colors.white,
    fontSize: font.sm,
    fontWeight: font.weightBold,
  },
  btnWarningText: {
    color: colors.warningText,
    fontSize: font.sm,
    fontWeight: font.weightBold,
  },
});
