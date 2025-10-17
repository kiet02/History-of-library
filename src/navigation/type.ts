import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  List: undefined;
  Test: undefined;
  SharedTransitionScreen: {
    item: {
      mediaUrl: number;
      mediaSpecs: {
        width: number;
        height: number;
        pageX: number;
        pageY: number;
        borderRadius?: number;
      };
    };
  };
};

export type TStack = NativeStackNavigationProp<RootStackParamList>;

export type TRoute<Name extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  Name
>;
