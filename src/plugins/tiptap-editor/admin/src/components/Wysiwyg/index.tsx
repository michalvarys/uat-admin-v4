import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import Wrapper from './style'
import {
    Box,
    Stack,
    Flex,
    Field,
    Typography,
    FieldLabel,
} from '@strapi/design-system'
import { useIntl } from 'react-intl'
import MenuBar from './MenuBar'
import EditorDebug from './EditorDebug'

import { EditorContent } from '@tiptap/react'
import CharacterCounter from './CharacterCounter'
import { useCustomEditor } from './editor'

const Wysiwyg = (opts) => {
    const {
        hint,
        disabled,
        error,
        intlLabel,
        labelAction,
        name,
        onChange,
        placeholder,
        value,
        required,
        playground,
        description,
        attribute,
    } = opts

    const { formatMessage } = useIntl()
    const [debug, setDebug] = useState(false)
    const [content, setContent] = useState(value || '')

    const characterLimit = attribute?.maxLength || 0


    const editor = useCustomEditor(opts)

    useEffect(() => {
        if (!editor) return

        if (content === '') {
            setContent(value)
            editor.commands.setContent(value, false)
        }
    }, [editor])

    if (!editor) return null

    return (
        <Field required={required}>
            <Stack spacing={1}>
                <Box>
                    <FieldLabel action={labelAction}>
                        {' '}
                        {formatMessage(intlLabel)}
                    </FieldLabel>
                </Box>
                <Wrapper>
                    <Flex gap={1} alignItems={'flex-start'}>
                        <Box hasRadius overflow={'hidden'} style={{ flex: '1' }}>
                            <MenuBar
                                editor={editor}
                                debug={debug}
                                setDebug={setDebug}
                                playground={playground}
                            />
                            <Box
                                className="editor-content-wrapper"
                                padding={2}
                                background="neutral0"
                                maxHeight={'600px'}
                                minHeight={'100px'}
                                style={{ resize: 'vertical', overflow: 'auto' }}
                            >
                                {/* @ts-ignore */}
                                <EditorContent editor={editor} />
                            </Box>

                            {editor && (
                                <CharacterCounter
                                    editor={editor}
                                    characterLimit={characterLimit}
                                />
                            )}
                        </Box>
                        {debug && playground && (
                            <Box
                                style={{ flex: '1', position: 'relative' }}
                                hasRadius
                                overflow={'hidden'}
                                borderWidth="1px"
                                borderStyle="solid"
                                borderColor="neutral200"
                            >
                                <EditorDebug editor={editor} />
                            </Box>
                        )}
                    </Flex>
                </Wrapper>
                {error && (
                    <Typography variant="pi" textColor="danger600">
                        {formatMessage({ id: error, defaultMessage: error })}
                    </Typography>
                )}
                {description && (
                    <Typography variant="pi">
                        {formatMessage(description)}
                    </Typography>
                )}
            </Stack>
        </Field>
    )
}

Wysiwyg.defaultProps = {
    disabled: false,
    playground: false,
    error: '',
    labelAction: undefined,
    placeholder: null,
    required: false,
    value: '',
    hint: '',
    description: null,
}

Wysiwyg.propTypes = {
    hint: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    disabled: PropTypes.bool,
    playground: PropTypes.bool,
    error: PropTypes.string,
    intlLabel: PropTypes.shape({
        id: PropTypes.string.isRequired,
        defaultMessage: PropTypes.string.isRequired,
        values: PropTypes.object,
    }).isRequired,
    labelAction: PropTypes.element,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.shape({
        id: PropTypes.string.isRequired,
        defaultMessage: PropTypes.string.isRequired,
        values: PropTypes.object,
    }),
    required: PropTypes.bool,
    value: PropTypes.string,
    description: PropTypes.shape({
        id: PropTypes.string,
        defaultMessage: PropTypes.string,
    }),
}

export default Wysiwyg
