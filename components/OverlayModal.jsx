import React from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const OverlayModal = ({ visible, onClose,  children }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* Modal Content */}
        <Pressable style={styles.modalContainer}>
          <View style={styles.paperModal}>
            <View style={styles.content}>
              {children}
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default OverlayModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20
   },
  paperModal: {
    width: width * 0.8,
    maxWidth: 320,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 16,
    // Paper-like texture
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },

});