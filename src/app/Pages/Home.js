import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MailIcon from "@material-ui/icons/Mail";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";
import Collapse from "@material-ui/core/Collapse";
import Posts from "../Components/Posts";
import Users from "../Components/Users";
import Addpost from "../Components/Addpost";
import Editpost from "../Components/Editpost";
import Estats from "../Components/Estats";
import Viewpost from "../Components/Viewpost";
import { useLocation } from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function ResponsiveDrawer(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(true);
  const [view, setView] = useState("posts");
  const location = useLocation();
  const [editPostId, setEditPostId] = useState();

  useEffect(() => {
    if (location.state !== undefined) {
      switch (location.state.view) {
        case "edit_post":
          setEditPostId(location.state.value);
          setView("edit_post");
          break;
        case "viewpost":
          setEditPostId(location.state.value);
          setView("viewpost");
          break;
        case "users":
          //setEditPostId(location.state.value);
          setView("users");
          setLoading(true);
          const userd = JSON.parse(localStorage.getItem("user"));
          setUser(userd);
          setLoading(false);
          break;
      }
    }
  }, [location]);

  const handleClick = () => {
    setOpen(!open);
  };

  useEffect(() => {
    setLoading(true);
    const userd = JSON.parse(localStorage.getItem("user"));
    setUser(userd);
    setLoading(false);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  function drawer() {
    if (loading) {
      return (
        <React.Fragment>
          <CssBaseline />
          <Container maxWidth="sm" style={{ justifyContent: "center" }}>
            <CircularProgress />
          </Container>
        </React.Fragment>
      );
    } else {
      return (
        <div>
          <div className={classes.toolbar} />
          <Divider />
          <List>
            <ListItem
              button
              onClick={() => {
                setView("posts");
              }}
            >
              <ListItemIcon>
                <MailIcon />
              </ListItemIcon>
              <ListItemText primary={"Noticias"} />
            </ListItem>
          </List>
          <Divider />
          {user.r_admin == 1 && (
            <List>
              <ListItem button onClick={handleClick}>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Administración" />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem
                    button
                    className={classes.nested}
                    onClick={() => {
                      setView("users");
                    }}
                  >
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary="Usuarios" />
                  </ListItem>

                  {user.r_create == 1 && (
                    <ListItem
                      button
                      className={classes.nested}
                      onClick={() => {
                        setView("add_post");
                      }}
                    >
                      <ListItemIcon>
                        <StarBorder />
                      </ListItemIcon>
                      <ListItemText primary="Crear Noticia" />
                    </ListItem>
                  )}

                  <ListItem
                    button
                    className={classes.nested}
                    onClick={() => {
                      setView("stats");
                    }}
                  >
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary="Estadísticas" />
                  </ListItem>
                </List>
              </Collapse>
            </List>
          )}
        </div>
      );
    }
  }

  function getView() {
    switch (view) {
      case "posts":
        return <Posts />;
      case "users":
        return <Users />;
      case "add_post":
        return <Addpost />;
      case "edit_post":
        return <Editpost PostId={editPostId} />;
      case "stats":
        return <Estats />;
      case "viewpost":
        return <Viewpost post={editPostId} />;
      default:
        return <Posts />;
    }
  }

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Noticias
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer()}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer()}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {getView()}
      </main>
    </div>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
