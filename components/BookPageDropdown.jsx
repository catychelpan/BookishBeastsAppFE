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

const BookPageDropdown = ({ isOpen, setIsOpen, handleSelect, selectedOption }) => {

    const [options] = useState(["Books", "Notes", "Quotes"]);

   
    const [dropdownLayout, setDropdownLayout] = useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });

    const buttonRef = useRef();

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
            {options.map((status) => {
                if (status === selectedOption) {
                    return;
                }
                return <TouchableOpacity
                    key={status}
                    style={[
                        styles.option,
                        selectedOption === status && styles.selectedOption,
                    ]}
                    onPress={() => handleSelect(status)}
                >
                <Text
                    style={[
                        styles.optionText,
                        selectedOption === status && styles.selectedOptionText,
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
                <Text style={styles.buttonText}>{selectedOption}</Text>
                <MaterialIcons name="arrow-drop-down" size={24} color="black" style={isOpen && styles.arrowUp} />
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
                        top: '6%',
                        position: 'relative',
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
    height: 38
  },
  buttonText: {
    fontSize: 24,
    color: '#1C1C1C',
    fontFamily: 'Cygre-Bold',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  arrow: {
    fontSize: 10,
    color: '#666666',
    alignItems: 'flex-end'
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
    padding: 10,
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

export default BookPageDropdown;