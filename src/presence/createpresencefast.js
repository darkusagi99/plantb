import 'date-fns';
import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import {constants} from '../common';
import firebase from '../firebase';

class CreateFastPresence extends Component {

    // Constructeur
    constructor(props) {
        super(props);

        // Bind des méthodes
        this.handlePersonChange = this.handlePersonChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleArrivalChange = this.handleArrivalChange.bind(this);
        this.handleDepartureChange = this.handleDepartureChange.bind(this);
        this.handleMealChange = this.handleMealChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.resetHours = this.resetHours.bind(this);

        // Déclaration firebase
        this.peopleRef = firebase.firestore().collection('peoples');
        this.presenceRef = firebase.firestore().collection('presences');

        // Initialisation pour la date du jour
        var presenceDate = new Date();
        presenceDate.setHours(0);
        presenceDate.setMinutes(0);
        presenceDate.setSeconds(0);
        presenceDate.setMilliseconds(0);

        // Initialisation du state
        this.state = {
            presenceId : '',
            personId : '',
            selectedDate : presenceDate,
            arrivalTime : new Date(),
            depatureTime : new Date(),
            hasMeal : false,
            peoples: []
        }
    }

    // Chargement du composant
    componentDidMount() {

        var newPeople = [];
        var that = this;

        // Chargement liste personnes
        this.peopleRef.get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                var currentData = doc.data();
                currentData.id = doc.id;

                newPeople.push(currentData);

                that.setState({
                    peoples: newPeople
                });

                console.log(doc.id, " => ", doc.data());
            });
        });

        // Initialisation des heures
        this.state.arrivalTime.setHours(7);
        this.state.arrivalTime.setMinutes(0);
        this.state.arrivalTime.setSeconds(0);
        this.state.arrivalTime.setMilliseconds(0);
        this.state.depatureTime.setHours(16);
        this.state.depatureTime.setMinutes(30);
        this.state.arrivalTime.setSeconds(0);
        this.state.arrivalTime.setMilliseconds(0);

        if (this.props.match.params.id != undefined) {

        this.presenceRef.doc(this.props.match.params.id).get()
        .then(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            var currentData = doc.data();
            currentData.id = doc.id;

            that.setState({
                presenceId : doc.id,
                personId : currentData.personId,
                selectedDate : new Date(currentData.presenceDay.seconds*1000),
                arrivalTime : new Date(currentData.arrival.seconds*1000),
                depatureTime : new Date(currentData.departure.seconds*1000),
                hasMeal : currentData.hasMeal,
                previousPresence: ''
            });

            currentData.hasMeal ? that.refs.hasMeal.classList.add('active') : that.refs.hasMeal.classList.remove('active') ;
            currentData.hasMeal ? that.refs.hasMeal.innerHTML = "Avec Repas" : that.refs.hasMeal.innerHTML = "Sans Repas" ;

            console.log(doc.id, " => ", doc.data());
        });

        }

    }

    resetHours() {
        // RAZ des heures
        var arrivalDate = new Date();
        var departureDate = new Date();

        arrivalDate.setHours(7);
        arrivalDate.setMinutes(0);
        arrivalDate.setSeconds(0);
        arrivalDate.setMilliseconds(0);
        departureDate.setHours(16);
        departureDate.setMinutes(30);
        departureDate.setSeconds(0);
        departureDate.setMilliseconds(0);

        this.setState({
            arrivalTime : arrivalDate,
            depatureTime : departureDate
        });

    }

    handlePersonChange = e => {

        var that = this;

        console.log("SearchDate => ", Math.round((this.state.selectedDate).getTime() / 1000));

        // RAZ des heures
        this.resetHours();

        this.presenceRef
        .where("personId", "==", e.target.value)
        //.where("presenceDay.seconds", "==", 1573426800)
        .get()
        .then(function(querySnapshot) {
            if(!querySnapshot.empty) {
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    var currentData = doc.data();
                    currentData.id = doc.id;


                    console.log(" => ", that.state.selectedDate.getTime());
                    console.log(" => ", currentData.presenceDay.seconds*1000);

                    if(that.state.selectedDate.getTime() == currentData.presenceDay.seconds*1000) {

                        that.setState({
                            presenceId : doc.id,
                            personId : currentData.personId,
                            selectedDate : new Date(currentData.presenceDay.seconds*1000),
                            arrivalTime : new Date(currentData.arrival.seconds*1000),
                            depatureTime : new Date(currentData.departure.seconds*1000),
                            hasMeal : currentData.hasMeal
                        });


                        currentData.hasMeal ? that.refs.hasMeal.classList.add('active') : that.refs.hasMeal.classList.remove('active') ;
                        currentData.hasMeal ? that.refs.hasMeal.innerHTML = "Avec Repas" : that.refs.hasMeal.innerHTML = "Sans Repas" ;

                        console.log(doc.id, " => ", doc.data());

                    }
                });
            }
        });

        this.setState({
        personId : e.target.value
        });

    }

    handleDateChange = date => {

        var that = this;

        console.log("SearchDate => ", Math.round((date).getTime() / 1000));

        // RAZ des heures
        this.resetHours();

        this.presenceRef
        .where("personId", "==", this.state.personId)
        .get()
        .then(function(querySnapshot) {
            if(!querySnapshot.empty)  {
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    var currentData = doc.data();
                    currentData.id = doc.id;


                    console.log(" => ", that.state.selectedDate.getTime());
                    console.log(" => ", currentData.presenceDay.seconds*1000);

                    if(that.state.selectedDate.getTime() == currentData.presenceDay.seconds*1000) {

                        that.setState({
                            presenceId : doc.id,
                            personId : currentData.personId,
                            selectedDate : new Date(currentData.presenceDay.seconds*1000),
                            arrivalTime : new Date(currentData.arrival.seconds*1000),
                            depatureTime : new Date(currentData.departure.seconds*1000),
                            hasMeal : currentData.hasMeal
                        });

                        currentData.hasMeal ? that.refs.hasMeal.classList.add('active') : that.refs.hasMeal.classList.remove('active') ;
                        currentData.hasMeal ? that.refs.hasMeal.innerHTML = "Avec Repas" : that.refs.hasMeal.innerHTML = "Sans Repas" ;

                        console.log(doc.id, " => ", doc.data());

                    }
                });
            }
        });

        this.setState({
            selectedDate : date
        });
    }

    handleArrivalChange = date => {
        this.setState({
            arrivalTime : date
        });
    }

    handleDepartureChange = date => {
        this.setState({
            depatureTime : date
        });
    }

    handleMealChange(e) {
        const item = e.target.value;
        e.target.classList.toggle('active');
        const active = e.target.classList.contains('active');
        this.state.hasMeal = active;

        if (active) {
            e.target.innerHTML = "Avec Repas";
        }  else {
            e.target.innerHTML = "Sans Repas";
        }
    }

    onSubmit(e) {
        e.preventDefault();

        if (this.state.presenceId == '') {

            this.presenceRef.add({
                personId : this.state.personId,
                presenceDay : this.state.selectedDate,
                arrival : this.state.arrivalTime,
                departure : this.state.depatureTime,
                hasMeal : this.state.hasMeal
            })
            .then((docRef) => {
                this.props.history.push("/presence/list")
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });

        } else {

            const obj = {
                id : this.state.presenceId,
                personId : this.state.personId,
                presenceDay : this.state.selectedDate,
                arrival : this.state.arrivalTime,
                departure : this.state.depatureTime,
                hasMeal : this.state.hasMeal
            };

            this.presenceRef.doc(this.state.presenceId).set(obj)
            .then(this.props.history.push(`/presence/list`))
            .catch(error => {console.log(error);});

        }

    }

    render() {
        return (
            <div style={{marginTop: 10}}>
                <h3>Presence</h3>
                <form onSubmit={this.onSubmit}>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <label class="input-group-text" for="inputGroupPerson">Eleve</label>
                        </div>

                        <select class="custom-select" id="inputGroupPerson" value={this.state.personId} onChange={this.handlePersonChange}>

                            <option selected>Choix...</option>
                            {this.state.peoples.map((people) => (
                                <option value={people.id} >{people.fullname}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Date"
                            autoOk="true"
                            value={this.state.selectedDate}
                            onChange={this.handleDateChange}
                            KeyboardButtonProps={{
                            'aria-label': 'change date',
                            }}
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                    <div className="form-group">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardTimePicker
                            margin="normal"
                            id="time-picker"
                            label="Arrive"
                            ampm={false}
                            value={this.state.arrivalTime}
                            onChange={this.handleArrivalChange}
                            KeyboardButtonProps={{
                            'aria-label': 'change time',
                            }}
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                    <div className="form-group">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardTimePicker
                            margin="normal"
                            id="time-picker"
                            label="Depart"
                            ampm={false}
                            value={this.state.depatureTime}
                            onChange={this.handleDepartureChange}
                            KeyboardButtonProps={{
                            'aria-label': 'change time',
                            }}
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                    <div className="form-group">
                        <div class="btn-group btn-group-toggle" data-toggle="buttons">
                            <button type="button" class="btn btn-secondary" onClick={this.handleMealChange} ref="hasMeal">Sans Repas</button>
                        </div>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Save" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }

};


export default CreateFastPresence