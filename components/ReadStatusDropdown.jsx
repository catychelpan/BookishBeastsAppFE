import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const BookStatusDropdown = ({ statusOptions, onSelect, selectedStatus, setSelectedStatus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownLayout, setDropdownLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const buttonRef = useRef();


  const handleSelect = async (status) => {
    try {
      await onSelect(status);
      setSelectedStatus(status);
      setIsOpen(false);
    } catch(error) {
      console.log(error);
    }
  };

  const measureButton = () => {
    if (buttonRef.current) {
      buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
        setDropdownLayout({
          x: pageX,
          y: pageY + height,
          width: width,
          height: height,
        });
      });
    }
  };

  const toggleDropdown = () => {
    measureButton();
    setIsOpen(!isOpen);
  };

  const renderStatuses = () => {
      return  (
        <>
          {statusOptions.map((status) => {
              if (status === selectedStatus) {
                  return;
              }
              return <TouchableOpacity
                  key={status}
                  style={[
                      styles.option,
                      selectedStatus === status && styles.selectedOption,
                  ]}
                  onPress={async () => await handleSelect(status)}
              >
              <Text
                  style={[
                      styles.optionText,
                      selectedStatus === status && styles.selectedOptionText,
                  ]}
              >
                  {status}
              </Text>
          </TouchableOpacity>
          })}
      </>
    );
  }

  return (
    <View className="relative">
      <TouchableOpacity
        ref={buttonRef}
        style={styles.button}
        onPress={toggleDropdown}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>{selectedStatus}</Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="white" style={isOpen && styles.arrowUp} />
      </TouchableOpacity>
      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setIsOpen(false)}
        >
          <View
            style={[
              styles.dropdown,
              {
                position: 'relative',
                top: "25%",
                left: dropdownLayout.x,
                width: dropdownLayout.width,
              },
            ]}
          >
          { renderStatuses() }
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    borderRadius: 25,
    borderWidth: 1,
    maxWidth: 168,
    height: 38
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Cygre-Bold',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  arrow: {
    fontSize: 12,
    color: '#666666',
  },
  arrowUp: {
    transform: [{ rotate: '180deg' }],
  },
  modalOverlay: {
    flex: 1,
  },
  dropdown: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: 200,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: '#f8f8f8',
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
  },
  selectedOptionText: {
    color: '#007AFF',
  },
});

export default BookStatusDropdown;