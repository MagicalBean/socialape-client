import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import TooltippedButton from "../../util/TooltippedButton";
// MUI Stuff
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
// Icons
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
// Redux Stuff
import { connect } from "react-redux";
import { postScream, clearErrors } from "../../redux/actions/dataActions";

const styles = theme => ({
  ...theme.spread,
  button: {
    position: "absolute",
    top: "103%",
    left: "85%"
  },
  submitButton: {
    position: "relative",
    marginTop: 10,
    marginBottom: 10
  },
  progressSpinner: {
    position: "absolute"
  },
  closeButton: {
    position: "absolute",
    left: "91%",
    top: "6%"
  }
});

class PostScream extends Component {
  state = {
    open: false,
    body: "",
    errors: {}
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({
        errors: nextProps.UI.errors
      });
    }
    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({ body: "", open: false, errors: {} });
    }
  }
  createFormData = () => {
    const image = document.getElementById("postImageInput").files[0];
    let formData;
    if (image) {
      formData = new FormData();
      formData.append("image", image, image.name);
    }
    return formData;
  };

  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.props.clearErrors();
    this.setState({ open: false, errors: {} });
  };
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleEditPicture = () => {
    const fileInput = document.getElementById("postImageInput");
    fileInput.click();
  };
  handleImageChange = event => {
    var reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById("preview").src = e.target.result;
    };

    reader.readAsDataURL(event.target.files[0]);
  };
  handleSubmit = event => {
    event.preventDefault();
    this.props.postScream({ body: this.state.body }, this.createFormData());
  };
  render() {
    const { errors } = this.state;
    const {
      classes,
      UI: { loading }
    } = this.props;

    const previewImage =
      "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

    return (
      <Fragment>
        <TooltippedButton onClick={this.handleOpen} tip="Post a Scream!">
          <AddIcon />
        </TooltippedButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <TooltippedButton
            tip="Close"
            onClick={this.handleClose}
            tipClassName={classes.closeButton}
          >
            <CloseIcon />
          </TooltippedButton>
          <DialogTitle>Post a new scream</DialogTitle>
          <DialogContent>
            <form onSubmit={this.handleSubmit}>
              <Grid container justify="space-between" spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    name="body"
                    type="text"
                    label="Scream"
                    multiline
                    rows="4"
                    placeholder="Scream at your fellow apes"
                    error={errors.body ? true : false}
                    helperText={errors.body}
                    className={classes.textField}
                    onChange={this.handleChange}
                    fullWidth
                  />
                </Grid>
                <div style={{ borderLeft: "1px solid black", height: "80%", position: 'absolute', left: "50%", top: "10%" }} />
                <Grid item xs={6} style={{ position: "relative" }}>
                  <input
                    type="file"
                    id="postImageInput"
                    hidden="hidden"
                    onChange={this.handleImageChange}
                  />
                  <img
                    id="preview"
                    src={previewImage}
                    alt="preview"
                    style={{
                      height: 112,
                      width: "100%",
                      position: "relative",
                      objectFit: "cover"
                    }}
                  />
                  <TooltippedButton
                    tip="Choose image"
                    onClick={this.handleEditPicture}
                    btnClassName={classes.button}
                  >
                    <EditIcon color="primary" />
                  </TooltippedButton>
                </Grid>
              </Grid>
              <Grid container alignContent="center">
                <Grid item style={{ textAlign: "center" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.submitButton}
                    disabled={loading}
                  >
                    Submit
                    {loading && (
                      <CircularProgress
                        size={30}
                        className={classes.progressSpinner}
                      />
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

PostScream.propTypes = {
  postScream: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  UI: state.UI
});

export default connect(mapStateToProps, { postScream, clearErrors })(
  withStyles(styles)(PostScream)
);
