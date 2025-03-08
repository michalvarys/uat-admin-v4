import React from 'react';
import { Box } from '@chakra-ui/react';
import { colors } from '@ssupat/components'
import { BoxAttributes } from './box/BoxExtension';
import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    Flex,
    Grid,
    NumberInput,
    MultiSelectOption,
    MultiSelect,
    Switch,
    TextInput,
    Tabs,
    Tab,
    TabGroup,
    TabPanel,
    TabPanels,
} from "@strapi/design-system"

const ColorOption = ({ color, label, value }: { color: string, label: string, value: string }) => {
    // Získání skutečné barvy pro náhled
    const getColorValue = (colorKey: string) => {
        if (!colorKey) return undefined;
        if (colors[colorKey]) return colors[colorKey];
        const [group, shade] = colorKey.split('.');
        return colors[group]?.[shade];
    };

    const colorValue = getColorValue(value);

    return (
        <MultiSelectOption value={value}>
            <Flex alignItems="center" gap={2}>
                <Box
                    style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '3px',
                        backgroundColor: colorValue,
                        border: '1px solid rgba(0,0,0,0.1)',
                    }}
                />
                {label}
            </Flex>
        </MultiSelectOption>
    );
};

export function ColorsSelect({
    value,
    label,
    onChange,
}: {
    value: any;
    label: string;
    onChange: (attrs: any) => void;
}) {
    const getColorOptions = () => (
        <>
            <MultiSelectOption value="">None</MultiSelectOption>

            {/* Base Colors */}
            <MultiSelectOption value="none" disabled>── Base Colors ──</MultiSelectOption>
            {['transparent', 'current', 'black', 'white'].map(color => (
                <ColorOption
                    key={color}
                    value={color}
                    label={color}
                    color={colors[color]}
                />
            ))}

            {/* Brand Colors */}
            <MultiSelectOption value="none" disabled>── Brand Colors ──</MultiSelectOption>
            {['uat_dark', 'uat_light', 'uat_green', 'uat_orange'].map(color => (
                <ColorOption
                    key={color}
                    value={color}
                    label={color}
                    color={colors[color]}
                />
            ))}

            {/* Alpha Colors */}
            {['whiteAlpha', 'blackAlpha'].map(colorGroup => (
                <React.Fragment key={colorGroup}>
                    <MultiSelectOption value="none" disabled>{`── ${colorGroup} ──`}</MultiSelectOption>
                    {Object.keys(colors[colorGroup]).map(shade => (
                        <ColorOption
                            key={`${colorGroup}.${shade}`}
                            value={`${colorGroup}.${shade}`}
                            label={`${colorGroup} ${shade}`}
                            color={colors[colorGroup][shade]}
                        />
                    ))}
                </React.Fragment>
            ))}

            {/* Primary Colors */}
            {['gray', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'cyan', 'purple', 'pink'].map(colorGroup => (
                <React.Fragment key={colorGroup}>
                    <MultiSelectOption value="none" disabled>{`── ${colorGroup} ──`}</MultiSelectOption>
                    {Object.keys(colors[colorGroup]).map(shade => (
                        <ColorOption
                            key={`${colorGroup}.${shade}`}
                            value={`${colorGroup}.${shade}`}
                            label={`${colorGroup} ${shade}`}
                            color={colors[colorGroup][shade]}
                        />
                    ))}
                </React.Fragment>
            ))}

            {/* Social Colors */}
            {['linkedin', 'facebook', 'messenger', 'whatsapp', 'twitter', 'telegram'].map(colorGroup => (
                <React.Fragment key={colorGroup}>
                    <MultiSelectOption value="none" disabled>{`── ${colorGroup} ──`}</MultiSelectOption>
                    {Object.keys(colors[colorGroup]).map(shade => (
                        <ColorOption
                            key={`${colorGroup}.${shade}`}
                            value={`${colorGroup}.${shade}`}
                            label={`${colorGroup} ${shade}`}
                            color={colors[colorGroup][shade]}
                        />
                    ))}
                </React.Fragment>
            ))}
        </>
    );

    return (
        <MultiSelect
            label={label}
            value={value}
            onChange={onChange}
        >
            {getColorOptions()}
        </MultiSelect>
    )
}