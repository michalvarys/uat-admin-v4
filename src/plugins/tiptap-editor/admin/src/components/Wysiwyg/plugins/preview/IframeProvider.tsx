import {
    EnvironmentProvider,
    useMediaQuery,
    Box,
    chakra,
} from "@chakra-ui/react"
import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import Iframe, { FrameContextConsumer } from "react-frame-component"
import { ChakraProvider } from "../../../../theme"

function memoize<T extends object, R>(func: (arg: T) => R): (arg: T) => R {
    const cache = new WeakMap<T, R>()
    return (arg: T) => {
        if (cache.has(arg)) return cache.get(arg)!
        const ret = func(arg)
        cache.set(arg, ret)
        return ret
    }
}

const createCacheFn = memoize((container: HTMLElement) =>
    createCache({ container, key: "frame" }),
)

// Component to display the current Chakra UI breakpoint
const MediaQueryIndicator = () => {
    const [isSm] = useMediaQuery("(min-width: 30em)") // 480px
    const [isMd] = useMediaQuery("(min-width: 48em)") // 768px
    const [isLg] = useMediaQuery("(min-width: 62em)") // 992px
    const [isXl] = useMediaQuery("(min-width: 80em)") // 1280px
    const [is2Xl] = useMediaQuery("(min-width: 96em)") // 1536px

    let breakpoint = "base"
    if (is2Xl) breakpoint = "2xl"
    else if (isXl) breakpoint = "xl"
    else if (isLg) breakpoint = "lg"
    else if (isMd) breakpoint = "md"
    else if (isSm) breakpoint = "sm"

    return (
        <Box
            position="fixed"
            top="10px"
            right="10px"
            bg="rgba(0, 0, 0, 0.7)"
            color="white"
            fontSize="12px"
            padding="5px 10px"
            borderRadius="4px"
            zIndex="9999"
        >
            {breakpoint}
        </Box>
    )
}

export const IframeProvider = (props: React.PropsWithChildren) => {
    const { children } = props
    return (
        <Iframe>
            <FrameContextConsumer>
                {(frame) => {
                    const head = frame.document?.head
                    if (!head) return null
                    return (
                        <CacheProvider value={createCacheFn(head)}>
                            <EnvironmentProvider environment={{
                                getDocument: () => frame.document!,
                                getWindow: () => frame.window!
                            }}>
                                <ChakraProvider>
                                    <MediaQueryIndicator />
                                    {children}
                                </ChakraProvider>
                            </EnvironmentProvider>
                        </CacheProvider>
                    )
                }}
            </FrameContextConsumer>
        </Iframe >
    )
}
