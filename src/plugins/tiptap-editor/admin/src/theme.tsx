import { Fonts, themeProps } from '@ssupat/components'
import { ChakraProvider as BaseChakraProvider, extendTheme } from '@chakra-ui/react'
export const theme = extendTheme({
    ...themeProps,
    styles: {
        ...themeProps.styles,
        global: {
            ...themeProps.styles?.global,
            'html, body': {
                backgrondColor: '#ffffff'
            },

            '.frame-content': {
            },

            '.frame-root': {
                paddingTop: 10
            }
        }
    }
})

export const ChakraProvider = ({ children }) => (
    <BaseChakraProvider theme={theme}>
        <Fonts />
        {children}
    </BaseChakraProvider>
)
