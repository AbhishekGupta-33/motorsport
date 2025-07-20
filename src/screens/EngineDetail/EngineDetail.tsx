import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Pressable,
  Platform,
  StyleSheet,
} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import {APP_IMAGE} from '../../../assets/images';
import {useRoute} from '@react-navigation/native';
import {theme} from '../../constants/theme';
import {downloadAndShareMP3} from '../../hooks/download';
import {useTranslation} from 'react-i18next';
import {useRingtoneSetter} from '../../hooks/useSetRingtone';
import {isTablet} from 'react-native-device-info';
import AppText from '../../components/AppText';
import SoundListModel from '../../components/SoundListModel';
import {useGyroSound} from '../../hooks/useGyroSound';

const {height, width} = Dimensions.get('window');

// TypeScript interfaces
interface MotorsportItem {
  id: string;
  title: string;
  model: string;
  engine: string;
  topSpeed: string;
  yearRange: string;
  bhp: string;
  chassis: string;
  image: string;
  sound: string;
}

interface ViewableItemsChanged {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}

const renderCarouselItem: ListRenderItem<MotorsportItem> = ({item, index}) => (
  <View style={styles.carouselItem}>
    <FastImage
      source={item}
      style={styles.carImage}
      resizeMode={FastImage.resizeMode.contain}
    />
  </View>
);

const EngineDetail: React.FC<any> = props => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSoundListModel, setIsSoundListModel] = useState(false);
  const [isPaymentModel, setIsPaymentModel] = useState(false);
  const [isDefaultPlay, setIsDefaultPlay] = useState(false);
  const [selectedSound, setSelectedSound] = useState('');
  const flatListRef = useRef<FlatList<any>>(null);
  const {t} = useTranslation();
  const {setRingtone} = useRingtoneSetter();
  const motorsportData = useRoute()?.params?.selectedCar;
  const {playSoundInFullVolume, stop} = useGyroSound(selectedSound);

  const onViewableItemsChanged = ({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  };

  const viewabilityConfig = {itemVisiblePercentThreshold: 50};

  const renderDot = (index: number) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.dot,
        {
          backgroundColor:
            index === currentIndex
              ? theme.color.selectedDotColor
              : index < currentIndex
              ? theme.color.selectedListDotColor
              : theme.color.borderLightGray,
        },
      ]}
      onPress={() =>
        flatListRef.current?.scrollToIndex({index, animated: true})
      }
    />
  );

  const onClosePress = () => props.navigation.goBack();

  const onPlay = async () => {
    if (motorsportData?.sound?.length > 1) {
      setIsSoundListModel(true);
      return;
    }
    if (Platform.OS === 'ios') {
      await downloadAndShareMP3(motorsportData?.sound[0]);
    } else {
      setRingtone(motorsportData?.sound[0]);
    }
  };

  const onPlayFromSoundList = async (item: string, isDefault: boolean) => {
    stop()
    setIsDefaultPlay(isDefault)
    setSelectedSound('');
    setTimeout(() => {
      setSelectedSound(item);
    }, 100);
  };

  const onPlayfullSound = async () => {

    const isPlayedThreeSecond = await playSoundInFullVolume(isDefaultPlay);
    if (isPlayedThreeSecond) {
      setIsPaymentModel(true);
    }
  };

  const onPurchase = () => {
    // Add purchase logic here
  };

  useEffect(() => {
    if (selectedSound) onPlayfullSound();
  }, [selectedSound]);

  return (
    <View style={styles.container}>
      <FastImage
        source={APP_IMAGE.LinearGradiant}
        style={styles.backgroundImage}
        resizeMode={FastImage.resizeMode.cover}
      />

      <View style={styles.topContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClosePress}>
          <AppText size={'md'} style={styles.closeText}>
            {t('close')} ✕
          </AppText>
        </TouchableOpacity>

        <View style={styles.viewCOntainerStyle}>
          {/* Left Panel - Engine Details */}
          <View style={styles.leftPanel}>
            <View style={styles.modelNameCntainer}>
              <AppText size={'sm'} style={styles.engineText}>
                {motorsportData.engine}
              </AppText>
            </View>
            <View style={styles.speedContainer}>
              <AppText size={'xs'} style={styles.speedtitle}>
                {t('topSpeedTitle')}
              </AppText>
              <AppText size={'xxxl'} style={styles.speedNumber}>
                {motorsportData.topSpeed}
              </AppText>
              <AppText size={'xs'} style={styles.speedUnit}>
                {t('SpeedUnit')}
              </AppText>
            </View>
            <View style={styles.yearView}>
              <AppText size={'xs'} style={styles.yearRange}>
                {t('yearRangeTitle')}
              </AppText>
              <AppText size={'md'} style={styles.yearText}>
                {motorsportData.yearRange}
              </AppText>
            </View>
          </View>

          {/* Center Panel - Title and Carousel */}
          <View style={styles.centerPanel}>
            <AppText size={'xxl'} style={styles.mainTitle}>
              {motorsportData.title}
            </AppText>
            <AppText size={'xl'} style={styles.modelText}>
              {motorsportData.model}
            </AppText>

            {/* Car Carousel */}
            {/* <View style={styles.carouselContainer}> */}
            <FlatList
              ref={flatListRef}
              data={motorsportData.images}
              renderItem={renderCarouselItem}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => `${item}`}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              style={styles.carousel}
            />
            {/* </View> */}

            {/* Dots Indicator */}
            <View style={styles.dotsContainer}>
              {motorsportData?.images?.map((_, index) => renderDot(index))}
            </View>
          </View>

          {/* Right Panel - Chassis and BHP */}
          <View style={styles.rightPanel}>
            <View style={styles.chassisView}>
              <AppText size={'xs'} style={styles.chassisLabel}>
                {t('chassisTitle')}
              </AppText>
              <AppText size={'sm'} style={styles.chassisText}>
                {motorsportData.chassis}
              </AppText>
            </View>

            <View style={styles.bhpContainer}>
              <AppText size={'xxxl'} style={styles.bhpNumber}>
                {motorsportData.bhp}
              </AppText>
              <AppText size={'sm'} style={styles.bhpUnit}>
                {t('bhp')}
              </AppText>
            </View>

            {/* Play Button */}
            <View style={styles.saveButtonView}>
              <Pressable style={styles.playButton} onPress={onPlay}>
                <FastImage
                  source={APP_IMAGE.save}
                  style={styles.playButtonStyle}
                  tintColor={theme.color.white}
                />
              </Pressable>
              <AppText size={'xs'} style={styles.experienceText}>
                {Platform.OS === 'android'
                  ? t('AndroidRingTone')
                  : t('IosSaveFile')}
              </AppText>
            </View>
          </View>
        </View>

        {/* SoundList Modal */}
        <SoundListModel
          visible={isSoundListModel}
          isPaymentModel={isPaymentModel}
          data={motorsportData?.sound}
          onClose={() => setIsSoundListModel(false)}
          onPaymentClose={() => setIsPaymentModel(false)}
          onPlay={onPlayFromSoundList}
          onPurchase={onPurchase}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    justifyContent: isTablet() ? 'space-evenly' : 'flex-start',
    flex: 1,
  },
  viewCOntainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: '1%',
    width: '95%',
    height: isTablet() ? '90%' : '80%',
    // flex: 1
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  closeButton: {
    marginVertical: 10,
    right: 80,
    alignSelf: 'flex-end',
    zIndex: 10,
  },
  closeText: {
    color: theme.color.white,
    fontWeight: '500',
  },
  leftPanel: {
    width: '25%',
    borderWidth: 1,
    borderColor: theme.color.borderLightGray,
    justifyContent: 'space-evenly',
  },
  modelNameCntainer: {
    justifyContent: 'center',
    alignContent: 'center',
    borderBottomWidth: 1,
    borderColor: theme.color.borderLightGray,
    flex: 1,
  },
  engineText: {
    color: theme.color.white,
    textAlign: 'center',
    padding: theme.spacing.md,
  },
  speedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderColor: theme.color.borderLightGray,
  },
  speedtitle: {
    color: theme.color.borderLightGray,
    textAlign: 'center',
  },
  speedNumber: {
    color: theme.color.white,
    fontWeight: 'bold',
  },
  speedUnit: {
    color: theme.color.borderLightGray,
  },
  yearView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  yearRange: {
    color: theme.color.borderLightGray,
    textAlign: 'center',
    marginBottom: 5,
  },
  yearText: {
    color: theme.color.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  centerPanel: {
    // justifyContent: 'center',
    width: '40%',
    alignItems: 'center',
  },
  mainTitle: {
    color: theme.color.white,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  modelText: {
    color: theme.color.white,
    fontWeight: '600',
    marginBottom: 30,
  },
  carouselContainer: {
    marginBottom: 20,
  },
  carousel: {
    width: isTablet() ? width * 0.45 : width * 0.4,
    height: isTablet() ? height * 0.6 : height * 0.4,
  },
  carouselItem: {
    width: isTablet() ? width * 0.45 : width * 0.4,
    height: isTablet() ? height * 0.6 : height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carImage: {
    width: isTablet() ? width * 0.4 : width * 0.35,
    height: isTablet() ? height * 0.6 : height * 0.38,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  rightPanel: {
    width: '25%',
    borderWidth: 1,
    borderColor: theme.color.borderLightGray,
    justifyContent: 'space-evenly',
  },
  chassisView: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingHorizontal: theme.spacing.md,
    borderBottomColor: theme.color.borderLightGray,
    flex: 1,
  },
  chassisLabel: {
    color: theme.color.borderLightGray,
    marginBottom: 5,
  },
  chassisText: {
    color: theme.color.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  bhpContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderBottomWidth: 1,
    borderColor: theme.color.borderLightGray,
  },
  bhpNumber: {
    color: theme.color.white,
    fontWeight: 'bold',
  },
  bhpUnit: {
    color: theme.color.borderLightGray,
    marginTop: -5,
  },
  playButton: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    paddingBottom: 10,
  },
  playIcon: {
    color: '#000',
    fontSize: 40,
    marginLeft: 3,
  },
  experienceText: {
    color: theme.color.borderLightGray,
    padding: theme.spacing.md,
    paddingTop: 0,
    textAlign: 'center',
  },
  playButtonStyle: {
    width: 40,
    height: 40,
    tintColor: theme.color.white,
  },
  saveButtonView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EngineDetail;
