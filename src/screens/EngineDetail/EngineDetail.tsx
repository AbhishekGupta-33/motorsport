import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  ListRenderItem,
  ViewToken,
  Pressable,
} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import {APP_IMAGE} from '../../../assets/images';
import {useNavigation} from '@react-navigation/native';
import {theme} from '../../constants/theme';
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

// Sample data for the carousel
const motorsportData: MotorsportItem[] = [
  {
    id: '1',
    title: 'BMW\n Motorsport',
    model: 'P13B16',
    engine: 'BMW 1.6 Liter Dry sump, Turbo, 4 Cylinder engine (1598cc)',
    topSpeed: '158',
    yearRange: '2011-2014',
    bhp: '310+',
    chassis: 'BMW E90 320 TC WTCC',
    image:
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=400&fit=crop',
    sound: 'demofour.mp3',
  },
  {
    id: '2',
    title: 'BMW Motorsport',
    model: 'M4 GT3',
    engine: 'BMW 3.0 Liter Twin-Turbo, 6 Cylinder engine (2993cc)',
    topSpeed: '180',
    yearRange: '2021-2024',
    bhp: '590+',
    chassis: 'BMW M4 GT3',
    image:
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=400&fit=crop',
    sound: 'demofive.mp3',
  },
  {
    id: '3',
    title: 'BMW Motorsport',
    model: 'M8 GTE',
    engine: 'BMW 4.0 Liter Twin-Turbo, V8 engine (3982cc)',
    topSpeed: '195',
    yearRange: '2018-2023',
    bhp: '500+',
    chassis: 'BMW M8 GTE',
    image:
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=400&fit=crop',
    sound: 'demothree.mp3',
  },
  {
    id: '4',
    title: 'BMW Motorsport',
    model: 'i4 M50',
    engine: 'BMW Electric Motor, Dual Motor setup (536hp)',
    topSpeed: '165',
    yearRange: '2022-2025',
    bhp: '536+',
    chassis: 'BMW i4 M50',
    image:
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=400&fit=crop',
    sound: 'demotwo.mp3',
  },
  {
    id: '5',
    title: 'BMW Motorsport',
    model: 'M2 CS',
    engine: 'BMW 3.0 Liter Twin-Turbo, 6 Cylinder engine (2979cc)',
    topSpeed: '174',
    yearRange: '2020-2022',
    bhp: '450+',
    chassis: 'BMW M2 CS',
    image:
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=400&fit=crop',
    sound: 'demo.mp3',
  },
];

const renderCarouselItem: ListRenderItem<MotorsportItem> = ({item, index}) => (
  <View style={styles.carouselItem}>
    <FastImage
      source={{uri: item.image}}
      style={styles.carImage}
      resizeMode={FastImage.resizeMode.contain}
    />
  </View>
);

const EngineDetail: React.FC<any> = ({navigation}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList<MotorsportItem>>(null);
  const {startSound, stop, isPlaying} = useGyroSound(
    motorsportData[currentIndex]?.sound,
  );

  useEffect(() => {
    if (isPlaying) {
      stop();
    }
  }, [currentIndex]);

  const onViewableItemsChanged = ({
    viewableItems,
  }: ViewableItemsChanged): void => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const renderDot = (index: number): JSX.Element => (
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
      onPress={() => {
        flatListRef.current?.scrollToIndex({index, animated: true});
      }}
    />
  );

  const currentItem: MotorsportItem = motorsportData[currentIndex];

  function onClosePress() {
    navigation.goBack();
  }
  function onPlay() {
    startSound();
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Background */}
      <FastImage
        source={APP_IMAGE.LinearGradiant}
        style={styles.backgroundImage}
        resizeMode={FastImage.resizeMode.cover}
      />

      <View style={styles.topContainer}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClosePress}>
          <Text style={styles.closeText}>Close ✕</Text>
        </TouchableOpacity>
        <View style={styles.viewCOntainerStyle}>
          {/* Left Panel - Engine Details */}
          <View style={styles.leftPanel}>
            <Text style={styles.engineText}>{currentItem.engine}</Text>
            <View style={styles.speedContainer}>
              <Text style={styles.speedtitle}>Estimated Top Speed</Text>
              <Text style={styles.speedNumber}>{currentItem.topSpeed}</Text>
              <Text style={styles.speedUnit}>MPH</Text>
            </View>
            <View style={styles.yearView}>
              <Text style={styles.yearRange}>Year Range</Text>
              <Text style={styles.yearText}>{currentItem.yearRange}</Text>
            </View>
          </View>

          {/* Center Panel - Title and Carousel */}
          <View style={styles.centerPanel}>
            <Text style={styles.mainTitle}>{currentItem.title}</Text>
            <Text style={styles.modelText}>{currentItem.model}</Text>

            {/* Car Carousel */}
            {/* <View style={styles.carouselContainer}> */}
            <FlatList
              ref={flatListRef}
              data={motorsportData}
              renderItem={renderCarouselItem}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              style={styles.carousel}
            />
            {/* </View> */}

            {/* Dots Indicator */}
            <View style={styles.dotsContainer}>
              {motorsportData.map((_, index) => renderDot(index))}
            </View>
          </View>

          {/* Right Panel - Chassis and BHP */}
          <View style={styles.rightPanel}>
            <View style={styles.chassisView}>
              <Text style={styles.chassisLabel}>Chassis</Text>
              <Text style={styles.chassisText}>{currentItem.chassis}</Text>
            </View>

            <View style={styles.bhpContainer}>
              <Text style={styles.bhpNumber}>{currentItem.bhp}</Text>
              <Text style={styles.bhpUnit}>BHP</Text>
            </View>

            {/* Play Button */}
            <Pressable style={styles.playButton} onPress={onPlay}>
              <FastImage
                source={APP_IMAGE.PlayButton}
                style={styles.playButtonStyle}
              />
            </Pressable>
            <Text style={styles.experienceText}>Experience the sound</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    justifyContent: 'space-between',
  },
  viewCOntainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: theme.spacing['xl'],
    width: '100%',
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
    // position: 'absolute',
    marginVertical: 10,
    right: 40,
    alignSelf: 'flex-end',
    zIndex: 10,
  },
  closeText: {
    color: theme.color.white,
    fontSize: 16,
    fontWeight: '500',
  },
  leftPanel: {
    // position: 'absolute',
    // left: 30,
    width: '25%',
    borderWidth: 1,
    borderColor: theme.color.borderLightGray,
  },
  engineText: {
    color: theme.color.white,
    fontSize: 14,
    lineHeight: 16,
    textAlign: 'center',
    borderBottomWidth: 1,
    padding: theme.spacing.md,
    borderColor: theme.color.borderLightGray,
  },
  speedContainer: {
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderColor: theme.color.borderLightGray,
  },
  speedtitle: {
    color: theme.color.borderLightGray,
    fontSize: 12,
    textAlign: 'center',
  },
  speedNumber: {
    color: theme.color.white,
    fontSize: 42,
    fontWeight: 'bold',
  },
  speedUnit: {
    color: theme.color.borderLightGray,
    fontSize: 12,
  },
  yearView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    // padding: theme.spacing.md,
  },
  yearRange: {
    color: theme.color.borderLightGray,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 5,
  },
  yearText: {
    color: theme.color.white,
    fontSize: 16,
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
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  modelText: {
    color: theme.color.white,
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 30,
  },
  carouselContainer: {
    marginBottom: 20,
  },
  carousel: {
    width: width * 0.4,
    height: height * 0.4,
  },
  carouselItem: {
    width: width * 0.4,
    height: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carImage: {
    width: width * 0.35,
    height: height * 0.38,
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
    // alignItems: 'center',
  },
  chassisView: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    padding: theme.spacing.md,
    borderBottomColor: theme.color.borderLightGray,
  },
  chassisLabel: {
    color: theme.color.borderLightGray,
    fontSize: 12,
    marginBottom: 5,
  },
  chassisText: {
    color: theme.color.white,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  bhpContainer: {
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: theme.spacing.md,
    borderColor: theme.color.borderLightGray,
  },
  bhpNumber: {
    color: theme.color.white,
    fontSize: 42,
    fontWeight: 'bold',
  },
  bhpUnit: {
    color: theme.color.borderLightGray,
    fontSize: 14,
    marginTop: -5,
  },
  playButton: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    paddingBottom: 10,
  },
  playIcon: {
    color: '#000',
    fontSize: 40,
    marginLeft: 3,
  },
  experienceText: {
    color: theme.color.white,
    fontSize: 12,
    padding: theme.spacing.md,
    paddingTop: 0,
    textAlign: 'center',
  },
  playButtonStyle: {
    width: 60,
    height: 60,
  },
});

export default EngineDetail;
