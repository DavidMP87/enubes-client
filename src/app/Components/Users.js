import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import FilterListIcon from "@material-ui/icons/FilterList";
import { config } from "../Config";
import axios from "axios";

function createData(
  id,
  name,
  lastname,
  email,
  r_admin,
  r_create,
  r_update,
  r_delete,
  r_change_state,
  r_edit_roles
) {
  return {
    id,
    name,
    lastname,
    email,
    r_admin,
    r_create,
    r_update,
    r_delete,
    r_change_state,
    r_edit_roles,
  };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "id",
    numeric: true,
    disablePadding: true,
    label: "Id",
  },
  { id: "name", numeric: true, disablePadding: false, label: "Nombre" },
  { id: "lastname", numeric: true, disablePadding: false, label: "Apellidos" },
  { id: "email", numeric: true, disablePadding: false, label: "Email" },
  { id: "r_admin", numeric: true, disablePadding: false, label: "Es Admin" },
  {
    id: "r_create",
    numeric: true,
    disablePadding: false,
    label: "Crear",
  },
  {
    id: "r_update",
    numeric: true,
    disablePadding: false,
    label: "Editar",
  },
  {
    id: "r_delete",
    numeric: true,
    disablePadding: false,
    label: "Eliminar",
  },
  {
    id: "r_change_state",
    numeric: true,
    disablePadding: false,
    label: "Cambiar estado",
  },
  {
    id: "r_edit_roles",
    numeric: true,
    disablePadding: false,
    label: "Editar roles",
  },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Usuarios
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">{/*<DeleteIcon /> */}</IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

export default function EnhancedTable() {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [loading, setLoading] = React.useState(5);
  const [rows, setRows] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setLoading(true);
    const userd = JSON.parse(localStorage.getItem("user"));
    setUser(userd);
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    getUsers();
  }, []);

  async function getUsers() {
    let userData = [];
    const urlApi = config.endpoint + "enubes/get_users/";

    var postData = new FormData();
    axios
      .post(urlApi, postData)
      .then(function (response) {
        if (response.status === 200) {
          response.data.users.map((user) => {
            userData.push(
              createData(
                user.id,
                user.name,
                user.last_name,
                user.email,
                user.r_admin,
                user.r_create,
                user.r_update,
                user.r_delete,
                user.r_change_state,
                user.r_edit_roles
              )
            );
          });
          setRows(userData);
          setLoading(false);
        }
      })
      .catch(function (error) {
        //console.log("error:", error);
      });
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleChangeAdmin = (id_user, value) => {
    let new_value = null;
    if (value == 1) {
      new_value = 0;
    } else {
      new_value = 1;
    }
    handleRol(id_user, "r_admin", new_value);
  };

  const handleChangeCreate = (id_user, value) => {
    let new_value = null;
    if (value == 1) {
      new_value = 0;
    } else {
      new_value = 1;
    }
    handleRol(id_user, "r_create", new_value);
  };

  const handleChangeUpdate = (id_user, value) => {
    let new_value = null;
    if (value == 1) {
      new_value = 0;
    } else {
      new_value = 1;
    }
    handleRol(id_user, "r_update", new_value);
  };

  const handleChangeDelete = (id_user, value) => {
    let new_value = null;
    if (value == 1) {
      new_value = 0;
    } else {
      new_value = 1;
    }
    handleRol(id_user, "r_delete", new_value);
  };

  const handleChangeState = (id_user, value) => {
    let new_value = null;
    if (value == 1) {
      new_value = 0;
    } else {
      new_value = 1;
    }
    handleRol(id_user, "r_change_state", new_value);
  };

  const handleChangeEditRoles = (id_user, value) => {
    let new_value = null;
    if (value == 1) {
      new_value = 0;
    } else {
      new_value = 1;
    }
    handleRol(id_user, "r_edit_roles", new_value);
  };

  function handleRol(id_user, rol_key, rol_value) {
    const urlApi = config.endpoint + "enubes/update_rol/";

    var postData = new FormData();
    postData.append("id_user", id_user);
    postData.append(rol_key, rol_value);

    axios
      .post(urlApi, postData)
      .then(function (response) {
        if (response.status === 200) {
          setRows([]);
          getUsers();
        }
      })
      .catch(function (error) {
        //console.log("error:", error);
      });
  }

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      {loading ? (
        <div></div>
      ) : (
        <Paper className={classes.paper}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.name)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.name}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ "aria-labelledby": labelId }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.id}
                        </TableCell>
                        <TableCell align="right">{row.name}</TableCell>
                        <TableCell align="right">{row.lastname}</TableCell>
                        <TableCell align="right">{row.email}</TableCell>
                        <TableCell align="right">
                          <Switch
                            checked={row.r_admin == 1 ? true : false}
                            onChange={() => {
                              handleChangeAdmin(row.id, row.r_admin);
                            }}
                            color="primary"
                            name="checkedB"
                            disabled={user.r_edit_roles == 0 ? true : false}
                            inputProps={{ "aria-label": "primary checkbox" }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Switch
                            checked={row.r_create == 1 ? true : false}
                            onChange={() => {
                              handleChangeCreate(row.id, row.r_create);
                            }}
                            color="primary"
                            name="checkedB"
                            disabled={user.r_edit_roles == 0 ? true : false}
                            inputProps={{ "aria-label": "primary checkbox" }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Switch
                            checked={row.r_update == 1 ? true : false}
                            onChange={() => {
                              handleChangeUpdate(row.id, row.r_update);
                            }}
                            color="primary"
                            name="checkedB"
                            disabled={user.r_edit_roles == 0 ? true : false}
                            inputProps={{ "aria-label": "primary checkbox" }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Switch
                            checked={row.r_delete == 1 ? true : false}
                            onChange={() => {
                              handleChangeDelete(row.id, row.r_delete);
                            }}
                            color="primary"
                            name="checkedB"
                            disabled={user.r_edit_roles == 0 ? true : false}
                            inputProps={{ "aria-label": "primary checkbox" }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Switch
                            checked={row.r_change_state == 1 ? true : false}
                            onChange={() => {
                              handleChangeState(row.id, row.r_change_state);
                            }}
                            color="primary"
                            name="checkedB"
                            disabled={user.r_edit_roles == 0 ? true : false}
                            inputProps={{ "aria-label": "primary checkbox" }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Switch
                            checked={row.r_edit_roles == 1 ? true : false}
                            onChange={() => {
                              handleChangeEditRoles(row.id, row.r_edit_roles);
                            }}
                            color="primary"
                            name="checkedB"
                            disabled={user.r_edit_roles == 0 ? true : false}
                            inputProps={{ "aria-label": "primary checkbox" }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </div>
  );
}
