import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Animated, TouchableOpacity, View, Text } from 'react-native';
import { colors, gstyle, loginStyle as tstyle } from '@/src/styles';

const LETTERS = ['L', 'O', 'G', 'I', 'N'];

export type AnimatedButtonHandle = {
    shake: () => void;
    flip: (success: boolean) => void;
};

type AnimatedButtonProps = {
    onPress: () => void;
    success: boolean;
    disabled?: boolean;
};

const AnimatedButton = forwardRef<AnimatedButtonHandle, AnimatedButtonProps>(
    ({ onPress, success, disabled }, ref) => {
        const shakeAnimation = useRef(new Animated.Value(0)).current;
        const flipAnimations = useRef(LETTERS.map(() => new Animated.Value(0))).current;
        const backgroundColors = useRef<Animated.Value[]>(LETTERS.map(() => new Animated.Value(0))).current;

        useImperativeHandle(ref, () => ({
            shake() {
                Animated.sequence([
                    Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
                    Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
                    Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
                    Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
                    Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
                ]).start();
            },
            flip(success) {
                const animations = flipAnimations.map(anim =>
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    })
                );
                const colorAnimations = backgroundColors.map(anim =>
                    Animated.timing(anim, {
                        toValue: success ? 1 : 0,
                        duration: 500,
                        useNativeDriver: false, // cores não suportam useNativeDriver
                    })
                );
                Animated.stagger(100, animations).start(() => {
                    // Depois que o flip acabar, anima as cores
                    Animated.parallel(colorAnimations).start(() => {
                        if (!success) {
                            // Aguarda mais um ciclo de animação antes de resetar
                            flipAnimations.forEach(anim => anim.setValue(0));
                        }
                    });
                });
            }
        }));

        const handlePress = () => {
            if (disabled) return;
            onPress();
        };

        return (
            <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
                <TouchableOpacity activeOpacity={1} style={tstyle.button} onPress={handlePress}>
                    <View style={tstyle.containerSquads}>
                        {LETTERS.map((char, index) => {
                            const rotateY = flipAnimations[index].interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '-180deg'],
                            });

                            const frontOpacity = flipAnimations[index].interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0],
                            });

                            const backOpacity = flipAnimations[index].interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 1],
                            });


                            return (
                                <Animated.View
                                    key={index}
                                    style={[
                                        tstyle.squad,
                                        { transform: [{ perspective: 1000 }, { rotateY }] },
                                    ]}
                                >
                                    {/* Frente */}
                                    <Animated.View
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderWidth: 3,
                                            borderRadius: 5,
                                            borderColor: colors.darkBrown,
                                            position: 'absolute',
                                            backfaceVisibility: 'hidden',
                                            backgroundColor: colors.primaryBrown,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            opacity: frontOpacity,
                                        }}
                                    >
                                        <Text style={[gstyle.mitrSemiBold, tstyle.squadText]}>{char}</Text>
                                    </Animated.View>

                                    {/* Verso */}
                                    <Animated.View
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            position: 'absolute',
                                            backfaceVisibility: 'visible',
                                            backgroundColor: success ? colors.rightLetter : colors.darkBrown,
                                            alignItems: 'center',
                                            borderRadius: 5,
                                            justifyContent: 'center',
                                            transform: [{ rotateY: '180deg' }],
                                            opacity: backOpacity,
                                        }}
                                    >
                                        <Text style={[gstyle.mitrSemiBold, tstyle.squadText]}>{char}</Text>
                                    </Animated.View>
                                </Animated.View>
                            );
                        })}
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    }
);

export default AnimatedButton;