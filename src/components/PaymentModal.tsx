import React, {ReactNode} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  price?: string;
  buttonText?: string;
  onPurchase?: () => void;
  transparent?: boolean;
  animationType?: 'none' | 'slide' | 'fade';
  icon?: ReactNode;
  children?: ReactNode;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  price,
  buttonText,
  onPurchase,
  transparent = true,
  animationType = 'fade',
  children,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={transparent}
      animationType={animationType}
      onRequestClose={onClose}
      supportedOrientations={['landscape']}
      >
      {/* Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}>
        <View style={styles.modalContainer}>
          {/* Modal Content */}
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View style={styles.modalContent}>
              {/* Overlay for better text readability */}
              <View style={styles.overlay} />

              {/* Close Button */}
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>

              {/* Content Container */}
              <View style={styles.contentContainer}>
                {/* Title */}
                <Text style={styles.title}>{title}</Text>

                {/* Subtitle */}
                <Text style={styles.subtitle}>{subtitle}</Text>

                {/* Price */}
                {price && <Text style={styles.price}>$ {price}</Text>}

                {/* Custom Children Content */}
                {children}

                {/* Primary Button */}
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={onPurchase}
                  activeOpacity={0.8}>
                  <Text style={styles.primaryButtonText}>{buttonText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex:12
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // Responsive width for landscape/portrait
    width: screenWidth > screenHeight ? '70%' : '85%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: '#2A2D3A',
    borderRadius: 20,
    overflow: 'hidden',
    width: '100%',
    // minHeight: 300,
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 30,
    alignItems: 'center',
    zIndex: 5,
  },
  iconContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 25,
  },
  primaryButton: {
    backgroundColor: '#667eea', // Note: Linear gradients need additional libraries in RN
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    width: '100%',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default PaymentModal;
