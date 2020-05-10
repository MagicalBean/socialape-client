import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import TooltippedButton from "../../util/TooltippedButton";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";
import Comments from "./Comments";
import CommentForm from "./CommentForm";
// MUI Stuff
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
// Icons
import CloseIcon from "@material-ui/icons/Close";
import UnfoldMore from "@material-ui/icons/UnfoldMore";
import ChatIcon from "@material-ui/icons/Chat";
// Redux Stuff
import { connect } from "react-redux";
import { getScream, clearErrors } from "../../redux/actions/dataActions";

const styles = theme => ({
  ...theme.spread,
  profileImage: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: "50%",
    objectFit: "cover",
    top: "3.5%",
    left: "73%"
  },
  dialogContent: {
    padding: 20
  },
  closeButton: {
    position: "absolute",
    top: "",
    left: "92%"
  },
  imageUrl: {
    height: 200,
    maxWidth: 200,
    objectFit: "cover"
  },
  expandButton: {
    position: "absolute",
    left: "90%"
  },
  expandButtonImg: {
    position: "absolute",
    left: "58.5%"
  },
  spinnerDiv: {
    textAlign: "center",
    marginTop: 50,
    marginBottom: 50
  }
});

class ScreamDialog extends Component {
  state = {
    open: false,
    oldPath: "",
    newPath: "",
    getScreamData: false
  };
  componentDidMount() {
    if (this.props.openDialog && !this.state.getScreamData) {
      this.setState({ getScreamData: true });
      this.handleOpen();
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.openDialog && !this.state.getScreamData) {
      this.setState({ getScreamData: true });
      this.handleOpen();
    }
  }
  handleOpen = () => {
    let oldPath = window.location.pathname;

    const { userHandle, screamId } = this.props;
    const newPath = `/users/${userHandle}/scream/${screamId}`;

    if (oldPath === newPath) oldPath = `/users/${userHandle}`;

    window.history.pushState(null, null, newPath);

    this.setState({ open: true, oldPath, newPath });
    this.props.getScream(this.props.screamId);
  };
  handleClose = () => {
    window.history.pushState(null, null, this.state.oldPath);
    this.setState({ open: false, getScreamData: false });
    this.props.clearErrors();
  };
  render() {
    const {
      classes,
      scream: {
        screamId,
        body,
        createdAt,
        likeCount,
        commentCount,
        userImage,
        imageUrl,
        userHandle,
        comments
      },
      UI: { loading },
      hasImage,
      user: {
        authenticated,
        credentials: { handle }
      }
    } = this.props;

    const dialogMarkup = loading ? (
      <div className={classes.spinnerDiv}>
        <CircularProgress
          size={hasImage ? 200 : 88}
          thickness={hasImage ? 2 : 3.6}
        />
      </div>
    ) : (
      <Grid
        container
        spacing={2}
        justify={hasImage ? "space-between" : "center"}
      >
        {hasImage && (
          <Grid item sm={5}>
            <img src={imageUrl} alt="" className={classes.imageUrl} />
          </Grid>
        )}
        <Grid item sm={7}>
          <Typography
            component={Link}
            color="primary"
            variant="h5"
            to={`/users/${userHandle}`}
          >
            @{userHandle}
          </Typography>
          <hr className={classes.invisibleSeperator} />
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
          </Typography>
          <img src={userImage} alt="Profile" className={classes.profileImage} />
          <hr className={classes.invisibleSeperator} />
          <Typography variant="body1">{body}</Typography>
          <LikeButton screamId={screamId} />
          <span>
            {likeCount} Like{likeCount === 1 ? "" : "s"}
          </span>
          <TooltippedButton tip="comments">
            <ChatIcon color="primary" />
          </TooltippedButton>
          <span>
            {commentCount} Comment{commentCount !== 1 ? "s" : ""}
          </span>
        </Grid>
        <hr className={classes.visibleSeperator} />
        <CommentForm screamId={screamId} />
        {comments && (
          <Comments
            comments={comments}
            authenticated={authenticated}
            handle={handle}
          />
        )}
      </Grid>
    );
    return (
      <Fragment>
        <TooltippedButton
          onClick={this.handleOpen}
          tip="Expand scream"
          tipClassName={
            !hasImage ? classes.expandButton : classes.expandButtonImg
          }
        >
          <UnfoldMore color="primary" />
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
          <DialogContent className={classes.dialogContent}>
            {dialogMarkup}
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

ScreamDialog.propTypes = {
  clearErrors: PropTypes.func.isRequired,
  getScream: PropTypes.func.isRequired,
  screamId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  scream: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  hasImage: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  scream: state.data.scream,
  UI: state.UI,
  user: state.user
});

const mapActionsToProps = {
  getScream,
  clearErrors
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(ScreamDialog));
