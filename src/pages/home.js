import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getScreams } from "../redux/actions/dataActions";
import { getUsersList } from "../redux/actions/userActions";

// Components
import Scream from "../components/scream/Scream";
import Profile from "../components/profile/Profile";
import ScreamSkeleton from "../util/ScreamSkeleton";

class home extends Component {
  componentDidMount() {
    this.props.getScreams();
    this.props.getUsersList();
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.data.screams !== this.props.data.screams)
      this.props.data.screams = nextProps.data.screams;
    this.forceUpdate();
  }
  render() {
    const { screams, loading } = this.props.data;
    let recentScreamsMarkup = !loading ? (
      screams.map(scream => <Scream key={scream.screamId} scream={scream} />)
    ) : (
      <ScreamSkeleton />
    );
    return (
      <Grid container spacing={2}>
        <Grid item sm={8} xs={12}>
          {recentScreamsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    );
  }
}

home.propTypes = {
  getScreams: PropTypes.func.isRequired,
  getUsersList: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  data: state.data
});

export default connect(mapStateToProps, { getScreams, getUsersList })(home);
