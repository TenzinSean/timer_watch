import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import moment from 'moment';


function Timer({ interval, style }) {
  const pad = (n) => n < 10 ? '0' + n : n
  const duration = moment.duration(interval)
  const centiseconds = Math.floor(duration.milliseconds() / 10)
  return (
    <View style={styles.timercontainer}>
      <Text style={style}>
        {pad(duration.minutes())}:
        {pad(duration.seconds())},
        {pad(centiseconds)}
      </Text>
    </View>
  )
}

function RoundButton({ title, color, background, onPress, disabled }) {
  return (
    <TouchableOpacity
      onPress={() => !disabled && onPress()}
      activeOpacity={disabled ? 1.0 : 0.7}
      style={[ styles.button, { backgroundColor: background }]}>
      <View style={styles.buttonBorder}>
        <Text style={[ styles.buttonTitle, { color }]}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}

function Lap({ number, interval, fastest, slowest}) {
  const lapStyle = [
    styles.lap,
    fastest && styles.fastest,
    slowest && styles.slowest,
  ]
  return (
    <View style={styles.lap}>
      <Text style={lapStyle}>Lap {number}</Text>
      <Timer style={lapStyle} interval={interval}/>
    </View>
  )
}

function LapsTable({ laps, timer }) {
  const finishLaps = laps.slice(1)
  let min = Number.MAX_SAFE_INTEGER
  let max = Number.MIN_SAFE_INTEGER
  if (finishLaps.length > 2) {
    finishLaps.forEach(lap => {
      if(lap < min) min = lap
      if(lap > max) max = lap
    })
  }
  return (
    <ScrollView style={styles.scrollView}>
      {laps.map((lap, index) => (
        <Lap
          number={laps.length - index}
          key={laps.length - index}
          interval={index == 0 ? timer + lap : lap}
          fastest = {lap == min}
          slowest = {lap == max}
          />
      ))}
    </ScrollView>
  )
}

function ButtonRow({ children }) {
  return (
    <View style={styles.ButtonRow}>
      {children}
    </View>
  )
}
export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      start: 0,
      now: 0,
      laps: [ ],

    }
  }

  start = () => {
    const now = new Date().getTime()
    this.setState({
      start: now,
      now,
      laps: [0],
    })
    this.timer = setInterval(() => {
      this.setState({ now: new Date().getTime()})
    }, 100)
  }
  render() {
    const { laps, now, start } = this.state
    const timer = now - start;
    return (
      <View style={styles.container}>
        <Timer interval={timer} style={styles.timer}/>
        <ButtonRow>
          <RoundButton title='Reset' color='#fffff' background='#3D3D3D' />
          <RoundButton
            title='Start'
            color='#50D167'
            background='#1B361F'
            onPress={this.start} />
        </ButtonRow>
        <LapsTable laps={laps} timer={timer}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    alignItems: 'center',
    paddingTop: 130,
    paddingHorizontal: 20,
  },

  timer: {
    color: '#fff',
    fontSize: 76,
    fontWeight: '200',
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitle: {
    fontSize: 18,
  },
  buttonBorder: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    marginTop: 80,
    marginBottom: 30,

  },
  lapText: {
    color: '#ffff',
    fontSize: 19,
  },
  lap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#151515',
    borderTopWidth: 1,
    paddingVertical: 10,
  },
  ScrollView: {
    alignSelf: 'stretch',
  },
  fastest: {
    color: '#4BC05F',
  },
  slowest: {
    color: '#CC3531',
  },
  timercontainer: {
    flexDirection: 'row',
  }
});
