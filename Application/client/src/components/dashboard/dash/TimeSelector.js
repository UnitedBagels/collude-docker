import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    width: 200,
  },
});

function TimeSelector(props) {
  const { classes } = props;

  return (
    <form className={classes.container} noValidate>
      <TextField
        id="time"
        label={props.label}
        type="time"
        defaultValue="07:30"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 min
        }}
      />

    <TextField
        id="time"
        label={props.label}
        type="time"
        defaultValue="07:30"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 min
        }}
      />
    </form>
  );
}

TimeSelector.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TimeSelector);