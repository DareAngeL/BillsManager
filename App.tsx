import React, {createContext} from 'react';
import {GluestackUIProvider} from './src/components/ui/gluestack-ui-provider';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/modules/Home/Home';
import './global.css';
import {RootStackParamList} from './src/types/navigation';
import AddBill from './src/modules/AddBill/AddBill';
import {GlobalContext as GlobalContextType} from './src/types/types';

const Stack = createNativeStackNavigator<RootStackParamList>();
export const GlobalContext = createContext<GlobalContextType>({
  activeGroup: undefined,
  setActiveGroup: () => {},
});

function App(): React.JSX.Element {

  const [activeGroup, setActiveGroup] = React.useState<string | undefined>(undefined);

  return (
    <GlobalContext.Provider
      value={{
        activeGroup,
        setActiveGroup,
      }}>
      <GluestackUIProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AddBill"
              component={AddBill}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </GluestackUIProvider>
    </GlobalContext.Provider>
  );
}

export default App;
