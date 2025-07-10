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
    Platform,
  } from 'react-native';
  import FastImage from '@d11/react-native-fast-image';
  import {APP_IMAGE} from '../../../assets/images';
  import {useNavigation, useRoute} from '@react-navigation/native';
  import {theme} from '../../constants/theme';
  import {useGyroSound} from '../../hooks/useGyroSound';
  import {downloadAndShareMP3} from '../../hooks/download';
  import {useTranslation} from 'react-i18next';
  import {useRingtoneSetter} from '../../hooks/useSetRingtone';

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

  const EngineDetail: React.FC<any> = (props) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const flatListRef = useRef<FlatList<MotorsportItem>>(null);
    const {t} = useTranslation();
    const {setRingtone} = useRingtoneSetter();
    const motorsportData =useRoute()?.params?.selectedCar
    console.log('props?.route?.params-----',motorsportData)
    // Sample data for the carousel

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

    function onClosePress() {
      props.navigation.goBack();
    }
    async function onPlay() {
      if (Platform.OS === 'ios') {
        await downloadAndShareMP3(motorsportData?.sound);
      } else {
        setRingtone(motorsportData?.sound);
      }
    }

    return (
      <View style={styles.container}>
        {/* Background */}
        <FastImage
          source={APP_IMAGE.LinearGradiant}
          style={styles.backgroundImage}
          resizeMode={FastImage.resizeMode.cover}
        />

        <View style={styles.topContainer}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClosePress}>
            <Text style={styles.closeText}>{t('close')} ✕</Text>
          </TouchableOpacity>
          <View style={styles.viewCOntainerStyle}>
            {/* Left Panel - Engine Details */}
            <View style={styles.leftPanel}>
              <Text style={styles.engineText}>{motorsportData.engine}</Text>
              <View style={styles.speedContainer}>
                <Text style={styles.speedtitle}>{t('topSpeedTitle')}</Text>
                <Text style={styles.speedNumber}>{motorsportData.topSpeed}</Text>
                <Text style={styles.speedUnit}>{t('SpeedUnit')}</Text>
              </View>
              <View style={styles.yearView}>
                <Text style={styles.yearRange}>{t('yearRangeTitle')}</Text>
                <Text style={styles.yearText}>{motorsportData.yearRange}</Text>
              </View>
            </View>

            {/* Center Panel - Title and Carousel */}
            <View style={styles.centerPanel}>
              <Text style={styles.mainTitle}>{motorsportData.title}</Text>
              <Text style={styles.modelText}>{motorsportData.model}</Text>

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
                <Text style={styles.chassisLabel}>{t('chassisTitle')}</Text>
                <Text style={styles.chassisText}>{motorsportData.chassis}</Text>
              </View>

              <View style={styles.bhpContainer}>
                <Text style={styles.bhpNumber}>{motorsportData.bhp}</Text>
                <Text style={styles.bhpUnit}>{t('bhp')}</Text>
              </View>

              {/* Play Button */}
              <Pressable style={styles.playButton} onPress={onPlay}>
                <FastImage
                  source={APP_IMAGE.save}
                  style={styles.playButtonStyle}
                  tintColor={theme.color.white}
                />
              </Pressable>
              <Text style={styles.experienceText}>
                {Platform.OS === 'android'
                  ? t('AndroidRingTone')
                  : t('IosSaveFile')}
              </Text>
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
      width: '95%',
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
      right: 80,
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
      fontSize: 12,
      padding: theme.spacing.md,
      paddingTop: 0,
      textAlign: 'center',
    },
    playButtonStyle: {
      width: 40,
      height: 40,
      tintColor: theme.color.white
    },
  });

  export default EngineDetail;
