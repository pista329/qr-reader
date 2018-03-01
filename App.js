import React from 'react'
import { StyleSheet, Text, View, WebView, TouchableOpacity } from 'react-native'
import { BarCodeScanner, Permissions } from 'expo'
import { Ionicons } from '@expo/vector-icons'

export default class App extends React.Component {
  state = {
    hasCameraPermission: null,
    webview: false,
    url: ''
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({ hasCameraPermission: status === 'granted' })
  }

  _handleBarCodeRead = ({ type, data }) => {
    if (data.startsWith('http')) {
      this.setState({ url: data, webview: true })
    }
  }

  render() {
    const { hasCameraPermission, webview, url } = this.state

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>
    } else {
      return (
        <View style={{ flex: 1 }}>
          {webview && (
            <WebView
              source={{
                uri: url
              }}
              startInLoadingState
              scalesPageToFit
              javaScriptEnabled
              style={{ flex: 1 }}
            />
          )}
          {!webview && (
            <BarCodeScanner
              onBarCodeRead={this._handleBarCodeRead}
              style={StyleSheet.absoluteFill}
            />
          )}
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: 50,
              width: 50,
              height: 50,
              position: 'absolute',
              right: 5,
              bottom: 5
            }}
            onPress={() => this.setState({ webview: false })}
          >
            <Ionicons name="ios-qr-scanner-outline" size={32} color="green" />
          </TouchableOpacity>
        </View>
      )
    }
  }
}
