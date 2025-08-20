import React from 'react';
import {
  Modal,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
} from 'react-native';
import {APP_IMAGE} from '../../assets/images';
import FastImage from '@d11/react-native-fast-image';
import {theme} from '../constants/theme';
import AppText from './AppText';
import PaymentModal from './PaymentModal';
import {useTranslation} from 'react-i18next';

interface ModalListProps {
  visible: boolean;
  isPaymentModel: boolean;
  data: string[];
  onClose: () => void;
  onPurchase: () => void;
  onPaymentClose: (paymentModelState: boolean) => void;
  onPlay: (item: string, isDefault: boolean) => void;
}

const SoundListModel: React.FC<ModalListProps> = ({
  visible,
  isPaymentModel,
  data,
  onClose,
  onPurchase,
  onPaymentClose,
  onPlay,
}) => {
  const {t} = useTranslation();

  const handlePlayPress = (item: string, isDefault: boolean) => {
    onPlay(item, isDefault);
  };

  const renderItem = ({item, index}: {item: string; index: number}) => (
    <View style={styles.itemContainer}>
      <View style={styles.nameContainer}>
        <AppText size={'md'} style={styles.itemName}>
          {item.toUpperCase()}
        </AppText>
        {index === 0 && (
          <AppText size={'xs'} style={styles.defaultLabel}>
            {t('soundListModel.default')?.toUpperCase()}
          </AppText>
        )}
      </View>

      <TouchableOpacity style={styles.playButton} onPress={() => handlePlayPress(item, index === 0)}>
        <AppText size={'sm'} style={styles.playButtonText}>
          ▶ {t('soundListModel.play')}
        </AppText>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlayTint}>
        <FastImage
          source={APP_IMAGE.LinearGradiant}
          style={styles.overlayBackground}
          resizeMode={FastImage.resizeMode.stretch}>
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <AppText size={'md'} style={styles.modalTitle}>
                {t('soundListModel.title')}
              </AppText>
              <TouchableOpacity onPress={onClose} style={styles.closeButtonTouch}>
                <Text style={styles.closeButton}>✖</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={data}
              keyExtractor={(item, index) => `${item}_${index}`}
              renderItem={renderItem}
              contentContainerStyle={styles.flatListContent}
            />
          </View>

          <PaymentModal
            visible={isPaymentModel}
            onClose={() => onPaymentClose(false)}
            title={t('paymentModal.title')}
            subtitle={t('paymentModal.subtitle')}
            price={'2.99'}
            buttonText={t('paymentModal.buttonText')}
            onPurchase={onPurchase}
          />
        </FastImage>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayTint: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  overlayBackground: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: theme.spacing.md,
    marginTop: '5%',
    width: '50%',
    height: '70%',
  },
  modalContainer: {
    borderRadius: 12,
    padding: 16,
    width: '95%',
    maxHeight: Dimensions.get('window').height * 0.7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    color: theme.color.white,
  },
  closeButtonTouch: {
    padding: 8,
  },
  closeButton: {
    fontSize: 24,
    color: theme.color.white,
  },
  flatListContent: {
    paddingVertical: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: theme.color.borderExtraLightGray,
    // borderWidth: 0.8,
    borderRadius: 8,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    marginHorizontal: 5,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    marginRight: 10,
  },
  itemName: {
    color: theme.color.borderLightGray,
    fontWeight: '500',
  },
  defaultLabel: {
    backgroundColor: theme.color.borderExtraLightGray,
    color: theme.color.selectedListDotColor,
    fontWeight: 'bold',
    marginLeft: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    padding: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 25,
  },
  playButtonText: {
    color: theme.color.white,
    fontWeight: 'bold',
  },
});

export default SoundListModel;
