import { StylesConfig } from 'react-select/dist/declarations/src/styles';

export const select_styles: StylesConfig = {
    control: (provided) => ({
        ...provided,
        background: 'unset',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 0 2px rgba(0, 0, 0, 0.4)',
        cursor: 'pointer',
        "&:hover": {
            border: undefined
        }
    }),
    option: (provided, {isSelected, isFocused}) => {
        let backgroundColor = 'transparent';
        let border = '1px solid transparent';

        if (isFocused) {
            backgroundColor = '#36393f';
            border = '1px solid rgba(255, 255, 255, 0.05)';
        }
        if (isSelected) {
            backgroundColor = '#34396f';
            border = '1px solid rgba(82, 93, 226, 0.7)'
        }

        return {
            ...provided,
            alignItems: 'center',
            display: 'flex',
            cursor: 'pointer',
            border: border,
            borderRadius: '4px',
            padding: '0.8rem 1rem',
            margin: '3px 0',
            width: '100%',
            color: "#fff",
            backgroundColor,
        }
    },

    menu: (provided) => ({
        ...provided,
        marginTop: '0.5rem',
        boxShadow: 'none',
        backgroundColor: '#202226',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '5px'
    }),

    menuList: () => ({
        // In the future, you can add maxHeight to menuList
        // maxHeight: '300px',

        padding: '1rem',
    }),

    valueContainer: (provided) => {
        return {
            ...provided,
            padding: '0.8rem 1.6rem',
        }
    },

    singleValue: (provided) => {
        return {
            ...provided,
            color: '#dcddde',
        }
    },

    input: (provided) => ({
        ...provided,
        color: '#dcddde',
        margin: undefined,
        paddingTop: undefined,
        paddingBottom: undefined
    }),

    indicatorSeparator: (provided) => ({
        ...provided,
        display: 'none'
    }),

    dropdownIndicator: (provided) => ({
        ...provided,
        color: '#dcddde'
    }),
}