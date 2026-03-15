import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing, radius, font, layout } from "../theme/bootstrap";

export default function StudentModal({ visible, title, onClose, children }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={() => null}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
          <View style={styles.body}>{children}</View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing[3],
  },
  container: {
    width: "100%",
    maxWidth: layout.modalMax,
    backgroundColor: colors.white,
    borderRadius: radius.card,
    overflow: "hidden",
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: colors.white,
    fontWeight: font.weightBold,
    fontSize: font.lg,
  },
  closeButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radius.base,
  },
  closeText: {
    color: colors.white,
    fontSize: font.sm,
    fontWeight: font.weightBold,
  },
  body: {
    padding: spacing[3],
  },
});
