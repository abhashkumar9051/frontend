import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";

import RootNavigator from "./src/navigation/RootNavigator";
import { store } from "./src/redux/store";

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </Provider>
  );
}

export default App;