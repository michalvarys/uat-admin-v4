import React from 'react';
import { Box } from '@chakra-ui/react';
import { colors } from '@ssupat/components'
import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    Flex,
    Grid,
    NumberInput,
    Option,
    Select,
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
        try {
            const [group, shade] = colorKey.split('.');
            return colors[group][shade]
        } catch {
            return "inherit"
        }
    };

    const colorValue = getColorValue(value);

    return (
        <Option value={value}>
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
        </Option>
    );
};

export function ColorsSelect({
    value,
    label,
    onChange,
}: {
    value: string;
    label: string;
    onChange: (value: string) => void;
}) {
    const getColorOptions = () => (
        <>
            <Option value="">None</Option>

            {/* Base Colors */}
            <Option value="none" disabled>── Base Colors ──</Option>
            {['transparent', 'current', 'black', 'white'].map(color => (
                <ColorOption
                    key={color}
                    value={color}
                    label={color}
                    color={colors[color]}
                />
            ))}

            {/* Brand Colors */}
            <Option value="none" disabled>── Brand Colors ──</Option>
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
                    <Option value="none" disabled>{`── ${colorGroup} ──`}</Option>
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
                    <Option value="none" disabled>{`── ${colorGroup} ──`}</Option>
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
                    <Option value="none" disabled>{`── ${colorGroup} ──`}</Option>
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
        <Select
            label={label}
            value={value}
            onChange={onChange}
        >
            {getColorOptions()}
        </Select>
    )
}
