import React from 'react';
import TextField from '@material-ui/core/TextField';

export const renderReadTextField = (value, label) => {
    return (
        <TextField
            value={value}

            InputProps={
                {
                    readOnly: true,
                }
            }
        />
    )
};
