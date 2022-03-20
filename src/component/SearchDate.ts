import {createContext} from "react";

export type SearchDateState = {
    date: Date | undefined,
    setDate: (date: Date | undefined) => void
}

const SearchDateContext = createContext<SearchDateState>({
    date: undefined,
    setDate: _ => {}
})

export default SearchDateContext
