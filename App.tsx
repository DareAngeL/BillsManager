import React from 'react';
import { GluestackUIProvider } from './src/components/ui/gluestack-ui-provider';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/modules/Home/Home';
import './global.css';
import { RootStackParamList } from './src/types/navigation';
import AddBill from './src/modules/AddBill/AddBill';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <GluestackUIProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddBill"
            component={AddBill}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}

export default App;
