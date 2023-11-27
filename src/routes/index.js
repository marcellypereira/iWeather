import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Search from '../pages/Search';
import Dashboard from '../pages/Dashboard';

const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator>
       <Stack.Screen
        name="Search"
        component={Search}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

