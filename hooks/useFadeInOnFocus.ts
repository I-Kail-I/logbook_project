import { useIsFocused } from "@react-navigation/native";
import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export function useFadeInOnFocus(duration = 400) {
  const isFocused = useIsFocused();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (isFocused) {
      fadeAnim.setValue(0);
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [fadeAnim, isFocused, slideAnim, duration]);

  return { fadeAnim, slideAnim };
}
