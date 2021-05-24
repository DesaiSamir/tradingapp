import { useContext, useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { UserContext } from "../contexts/UserProvider";
import { 
    Table, TableBody,  TableCell, TableHead, TableRow, Input, IconButton, Button, 
    Dialog, DialogActions, DialogContent, DialogContentText
} from "@material-ui/core";
// Icons
import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";
import ArraySelect from "../components/formcontrols/ArraySelect";
import CachedIcon from '@material-ui/icons/Cached';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

const CustomTableCell = ({ row, name, onChange, settingUnits }) => {
    const classes = useStyles();
    const { isEditMode } = row;
    
    return (
        <TableCell align="left" className={classes.tableCell}>
            {isEditMode ? 
                name !== 'unit' ?
                    (<Input
                        value={row[name]}
                        name={name}
                        onChange={e => onChange(e, row)}
                        className={classes.input}
                    />) 
                    :
                    (<ArraySelect 
                        menuItems={settingUnits}
                        name={name}
                        title='Select Unit'
                        onSelectChange={e => onChange(e, row)}
                        defaultValue={row.unit}
                    />)
                : 
                (row[name])
            }
        </TableCell>
    );
};

const Admin = () => {
    const classes = useStyles();
    const { 
        settings, settingUnits, reloadSettings, saveSettings 
    } = useContext(UserContext);
    const [previous, setPrevious] = useState({});
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if(settings.length > 0){
            setRows(settings);
        }
    }, [settings])

    const onToggleEditMode = id => {
        setRows(state => {
            return rows.map(row => {
                if (row.id === id) {
                    return { ...row, isEditMode: !row.isEditMode };
                }
                return row;
            });
        });
    };
    
    const onChange = (e, row) => {
        if (!previous[row.id]) {
            setPrevious(state => ({ ...state, [row.id]: row }));
        }
        const value = e.target.value;
        const name = e.target.name;
        const { id } = row;
        const newRows = rows.map(row => {
            if (row.id === id) {
                return { ...row, [name]: value, isEdited: true };
            }
            return row;
        });
        
        setRows(newRows);
    };
    
    const onRevert = id => {
        const newRows = rows.map(row => {
          if (row.id === id) {
            return previous[id] ? previous[id] : row;
          }
          return row;
        });
        setRows(newRows);
        setPrevious(state => {
          delete state[id];
          return state;
        });
        onToggleEditMode(id);
    };

    const onAddNewRow = () => {
        const id = Math.random();
        const newRow = { 
            id: id,
            name: '', 
            value: '', 
            unit: 'General',
            isNew: true
        }
        
        const newRows = rows;
        newRows.push(newRow)
        
        setRows(newRows);
        
        onToggleEditMode(id);
    }

    const onRemoveRow = (id) => {
        const newRows = rows.filter(row => row.id !== id);
        console.log(newRows)
        setRows(newRows);
        setOpen(false);
    }

    const handleClickOpen = () => {
        setOpen(true);
      };
    
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <Table className={classes.table} aria-label="caption table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">
                            <IconButton
                                aria-label="done"
                                onClick={reloadSettings}
                            >
                                <CachedIcon />
                            </IconButton>
                            <IconButton
                                aria-label="add"
                                onClick={onAddNewRow}
                            >
                                <AddCircleOutlineIcon />
                            </IconButton>
                            <IconButton
                                aria-label="save"
                                onClick={() => saveSettings(rows)}
                            >
                                <SaveAltIcon />
                            </IconButton>
                            
                        </TableCell>
                        <TableCell align="left">Setting Name</TableCell>
                        <TableCell align="left">Setting Value</TableCell>
                        <TableCell align="left">Unit</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => (
                        <TableRow key={row.id}>
                            <TableCell className={classes.selectTableCell}>
                                {row.isEditMode ? (
                                    <>
                                        <IconButton
                                            aria-label="done"
                                            onClick={() => onToggleEditMode(row.id)}
                                        >
                                            <DoneIcon />
                                        </IconButton>
                                        <IconButton
                                            aria-label="revert"
                                            onClick={() => onRevert(row.id)}
                                        >
                                            <RevertIcon />
                                        </IconButton>
                                    </>
                                    ) :  
                                    (<>
                                        <IconButton
                                            aria-label="delete"
                                            onClick={() => onToggleEditMode(row.id)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            aria-label="revert"
                                            onClick={handleClickOpen}
                                        >
                                            <RevertIcon />
                                        </IconButton>
                                        <Dialog
                                            open={open}
                                            onClose={handleClose}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description"
                                        >
                                            <DialogContent>
                                                <DialogContentText id="remove-setting-dialog">
                                                    Are you sure you want to remove this setting?
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleClose} color="primary">
                                                    Disagree
                                                </Button>
                                                <Button onClick={() => onRemoveRow(row.id)} color="primary" autoFocus>
                                                    Agree
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </>)
                                }
                            </TableCell>
                            <CustomTableCell {...{ row, name: "name", onChange }} />
                            <CustomTableCell {...{ row, name: "value", onChange }} />
                            <CustomTableCell {...{ row, name: "unit", onChange, settingUnits }} />
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            
        </div>
    )
}

export default Admin

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    table: {
      minWidth: 650
    },
    selectTableCell: {
      width: 60
    },
    tableCell: {
      width: 130,
      height: 40
    },
    input: {
      width: 130,
      height: 40
    },
}));