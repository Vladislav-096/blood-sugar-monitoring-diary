import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";

// useDispatch, useSelector - редаксовые хуки
// Чтобы указать для них необходимые типы я должен реэкспортировать новые, с указанныеми стилями

// Since we don't have access to the store itself, we need some way to have access to the dispatch method.
// The useDispatch hook does that for us, and gives us the actual dispatch method from the Redux store
export const useAppDispatch = () => useDispatch<AppDispatch>();
// Selector functions allows us to select a value from the Redux root state.
// getState(): требует больше кода, управление подписками вручную, менее удобен. Может привести к ошибкам, если не управлять состоянием правильно.
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
