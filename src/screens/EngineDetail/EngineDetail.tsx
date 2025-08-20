import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Pressable,
  Platform,
  StyleSheet,
  ListRenderItem,
  ViewToken,
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
import Share from 'react-native-share';

const {height, width} = Dimensions.get('window');

// TypeScript interfaces
interface MotorsportItem {
  id: string;
  title: string;
  model: string;
  engine: string;
  enginDetail: string;
  topSpeed: string;
  yearRange: string;
  power: string;
  chassis: string;
  image: string;
  sound: string;
}

interface ViewableItemsChanged {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}

const renderCarouselItem: ListRenderItem<MotorsportItem> = ({item}) => (
  <View style={styles.carouselItem}>
    <FastImage
      source={item}
      style={styles.carImage}
      resizeMode={FastImage.resizeMode.stretch}
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
              ? theme.color.red
              : index < currentIndex
              ? theme.color.selectedDotColor
              : theme.color.black,
        },
      ]}
      onPress={() =>
        flatListRef.current?.scrollToIndex({index, animated: true})
      }
    />
  );

  const onClosePress = () => props.navigation.goBack();

  const onPlay = async () => {
    // if (motorsportData?.sound?.length > 1) {
    //   setIsSoundListModel(true);
    //   return;
    // }
    if (Platform.OS === 'ios') {
      await downloadAndShareMP3(motorsportData?.sound[0]);
    } else {
      setRingtone(motorsportData?.sound[0]);
    }
  };

  const onPlayFromSoundList = async (item: string, isDefault: boolean) => {
    stop();
    setIsDefaultPlay(isDefault);
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
  const handleShare = async () => {
    const options = {
      title: 'Share via',
      message: 'Check out this awesome React Native project!',
      url: 'https://reactnative.dev',
    };

    try {
      await Share.open(options);
    } catch (error: any) {
      // Alert.alert(error?.message);
    }
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
        tintColor={theme.color.white}
      />

      <View style={styles.topContainer}>
        <View style={styles.topView}>
          <TouchableOpacity style={styles.topleftView} onPress={handleShare}>
            <FastImage
              source={APP_IMAGE.shareIcon}
              style={styles.shareIconStyle}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClosePress}>
            <AppText size={'md'} style={styles.closeText}>
              {t('close')} ✕
            </AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.viewCOntainerStyle}>
          {/* Left Panel - Engine Details */}
          <View style={styles.leftPanel}>
            <View style={styles.listItemView}>
              <AppText size={'lg'} style={styles.listTitle}>
                {t('enginRace')}
              </AppText>
              <AppText size={'md'} style={styles.listDesText}>
                {motorsportData.engine}
              </AppText>
              <AppText size={'xs'} style={styles.listSubDesText}>
                {motorsportData.enginDetail}
              </AppText>
            </View>
            <View style={styles.speedContainer}>
              <AppText size={'lg'} style={styles.listTitle}>
                {t('topSpeedTitle')}
              </AppText>
              <AppText size={'md'} style={styles.listDesText}>
                {motorsportData.topSpeed}
              </AppText>
            </View>
            <View style={styles.listItemView}>
              <AppText size={'lg'} style={styles.listTitle}>
                {t('yearRangeTitle')}
              </AppText>
              <AppText size={'md'} style={styles.listDesText}>
                {motorsportData.yearRange}
              </AppText>
            </View>
          </View>

          {/* Center Panel - Title and Carousel */}
          <View style={styles.centerPanel}>
            <AppText size={'xxl'} style={styles.mainTitle}>
              {motorsportData.title}
            </AppText>
            <AppText size={'xxl'} style={styles.modelText}>
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

          {/* Right Panel - Chassis and Powe */}
          <View style={styles.rightPanel}>
            <View style={styles.listItemView}>
              <AppText size={'lg'} style={styles.listTitle}>
                {t('chassisTitle')}
              </AppText>
              <AppText size={'sm'} style={styles.listDesText}>
                {motorsportData.chassis}
              </AppText>
            </View>

            <View style={styles.bhpContainer}>
              <AppText size={'lg'} style={styles.listTitle}>
                {t('power')}
              </AppText>
              <AppText size={'sm'} style={styles.listDesText}>
                {motorsportData.power}
              </AppText>
            </View>

            {/* Play Button */}
            <View style={styles.listItemView}>
              <AppText size={'xs'} style={styles.experienceText}>
                {Platform.OS === 'android'
                  ? t('AndroidRingTone')
                  : t('IosSaveFile')}
              </AppText>
              <Pressable style={styles.playButton} onPress={onPlay}>
                <FastImage
                  source={APP_IMAGE.startEngine}
                  style={styles.playButtonStyle}
                />
              </Pressable>
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
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    padding: 10,
    paddingHorizontal: '5%' 
  },
  topleftView: {
    backgroundColor: theme.color.white + '50',
    padding: theme.spacing.sm,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  shareIconStyle: {
    height: 30,
    width: 30,
  },
  viewCOntainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: '1%',
    width: '98%',
    height: isTablet() ? '85%' : '80%',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  closeButton: {
  },
  closeText: {
    color: theme.color.red,
    fontWeight: 'bold',
  },
  leftPanel: {
    width: '25%',
    borderWidth: 1,
    borderColor: theme.color.black,
    justifyContent: 'space-evenly',
  },
  listItemView: {
    justifyContent: 'center',
    alignContent: 'center',
    flex: 1,
    padding: theme.spacing.md,
  },
  listTitle: {
    color: theme.color.black,
    letterSpacing: 1.1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listDesText: {
    color: theme.color.blue,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listSubDesText: {
    color: theme.color.blue,
    fontWeight: '500',
    textAlign: 'center',
  },
  bhpContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    padding: theme.spacing.md,
    borderColor: theme.color.black,
  },
  speedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.color.black,
  },
  centerPanel: {
    width: '40%',
    alignItems: 'center',
  },
  mainTitle: {
    color: theme.color.black,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  modelText: {
    color: theme.color.black,
    fontWeight: '600',
  },
  carousel: {
    width: isTablet() ? width * 0.42 : width * 0.4,
    height: isTablet() ? height * 0.6 : height * 0.4,
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  carImage: {
    width: isTablet() ? width * 0.42 : width * 0.4,
    height: isTablet() ? height * 0.6 : height * 0.4,
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
    borderColor: theme.color.black,
    justifyContent: 'space-evenly',
  },
  playButton: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  experienceText: {
    color: theme.color.black,
    paddingBottom: theme.spacing.md,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  playButtonStyle: {
    width: 50,
    height: 50,
  },
});

export default EngineDetail;
