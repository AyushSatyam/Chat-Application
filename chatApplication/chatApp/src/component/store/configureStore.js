import { applyMiddleware, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";
import storage from "redux-persist/lib/storage";
import rootReducer from "./reducers";
const persistConfug = {
  key: "root",
  storage,
};
const persistedReducer = persistReducer(persistConfug, rootReducer);

export default () => {
  let store = createStore(persistedReducer, applyMiddleware(thunk));
  let persistor = persistStore(store);
  return {
    store,
    persistor,
  };
};
