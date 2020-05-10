import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";
import TooltippedButton from "../../util/TooltippedButton";
import DeleteScream from "./DeleteScream";
import ScreamDialog from "./ScreamDialog";
import LikeButton from "./LikeButton";
// MUI Stuff
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
// Redux
import { connect } from "react-redux";
// Icons
import ChatIcon from "@material-ui/icons/Chat";

const styles = theme => ({
  card: {
    position: "relative",
    display: "flex",
    marginBottom: 20
  },
  profileImage: {
    minWidth: "100%",
    minHeight: "100%",
    objectFit: "cover"
  },
  image: {
    minWidth: "100%",
    minHeight: "100%",
    objectFit: "cover"
  },
  content: {
    padding: 25,
    objectFit: "cover"
  },
  userTag: {
    textDecoration: "none",
    color: theme.palette.primary.main
  }
});

class Scream extends Component {
  refreshScream = () => {
    this.forceUpdate();
  };
  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      scream: {
        body,
        imageUrl,
        createdAt,
        userImage,
        userHandle,
        screamId,
        likeCount,
        commentCount
      },
      user: {
        authenticated,
        credentials: { handle },
        users
      }
    } = this.props;

    const deleteButton =
      authenticated && userHandle === handle ? (
        <DeleteScream screamId={screamId} image={imageUrl.trim() === ""} />
      ) : null;

    let bodyComponent;
    const index = body.indexOf("@");
    if (index !== -1) {
      let string = body.substring(index + 1).split(" ")[0];
      if (users.includes(string)) {
        bodyComponent = (
          <span>
            {body.substring(0, index)}{" "}
            <Link className={classes.userTag} to={`/users/${string}`}>
              @{string}
            </Link>
            {body.substring(index + 1 + string.length)}
          </span>
        );
      }
    }

    console.log(bodyComponent);

    return (
      <Card className={classes.card}>
        <Grid container justify="space-between">
          <Grid item xs={3}>
            <CardMedia
              image={userImage}
              title="Profile image"
              className={classes.profileImage}
            />
          </Grid>
          <Grid item xs={5}>
            <CardContent className={classes.content}>
              <Typography
                variant="h5"
                component={Link}
                to={`/users/${userHandle}`}
                color="primary"
              >
                {userHandle}
              </Typography>
              {deleteButton}
              <Typography variant="body2" color="textSecondary">
                {dayjs(createdAt).fromNow()}
              </Typography>
              <Typography variant="body1">{bodyComponent}</Typography>
              <LikeButton screamId={screamId} />
              <span>
                {likeCount} Like{likeCount !== 1 ? "s" : ""}
              </span>
              <TooltippedButton tip="comments">
                <ChatIcon color="primary" />
              </TooltippedButton>
              <span>
                {commentCount} Comment{commentCount !== 1 ? "s" : ""}
              </span>
              <ScreamDialog
                screamId={screamId}
                userHandle={userHandle}
                hasImage={imageUrl ? true : false}
                openDialog={this.props.openDialog}
              />
            </CardContent>
          </Grid>
          <Grid item xs={4}>
            {imageUrl.trim() !== "" && (
              <CardMedia
                image={imageUrl}
                title="Post image"
                className={classes.image}
              />
            )}
          </Grid>
        </Grid>
      </Card>
    );
  }
}

Scream.propTypes = {
  user: PropTypes.object.isRequired,
  scream: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  openDialog: PropTypes.bool
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Scream));
