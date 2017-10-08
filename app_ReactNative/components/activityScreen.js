import React, { Component } from 'react';
import { View, Text, Dimensions, ScrollView, StyleSheet} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { VictoryChart, VictoryBar, VictoryTheme, VictoryAxis } from 'victory-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

var rangeSelector = [
  {label: 'Last week',  value: 0 },
  {label: 'Last month', value: 1 },
  {label: 'All records', value: 2 },
];
var rangeSelected = 0;
const hait = Dimensions.get('window').height * 0.35;
const wiz = Dimensions.get('window').width;
export default class activityScreen extends Component {
  // static navigationOptions = {
  //   title: 'Detail',
  //   headerTintColor: '#1A1047',
  // };
  componentWillMount () {
    const setParamsAction = NavigationActions.setParams({
      params: { hideTabBar: true },
      key: 'HomeStack',
    });
    this.props.navigation.dispatch(setParamsAction);
  };

  render() {
//    
      var ticks = []
      ticks[0] = []
      ticks[1] = []
      ticks[2] = []
      for (var i = 0; i < this.props.navigation.state.params.activityData[0].length; i++) {
        ticks[0][i] = this.props.navigation.state.params.activityData[0][i].c;
        console.log(this.props.navigation.state.params.activityData[0][i])
      };
      console.log(ticks)
      for (var i = 0; i < this.props.navigation.state.params.activityData[1].length; i++) {
        ticks[1][i] = this.props.navigation.state.params.activityData[0][i].c;
      };
      for (var i = 0; i < this.props.navigation.state.params.activityData[2].length; i++) {
        ticks[2][i] = this.props.navigation.state.params.activityData[0][i].c;
      };
      return (
         <View style={styles.container}>
           <View style={styles.chartContainer}>
            <VictoryChart
              theme={VictoryTheme.material}
              height={hait}
              padding={{ top: 10, bottom: 30, left: 10, right: 10 }}
              domainPadding={{x: (wiz*0.6)/this.props.navigation.state.params.activityData[rangeSelected].length, y: hait*0.1}}
            >
              <VictoryAxis 
                tickCount={Math.min(8, this.props.navigation.state.params.activityData[rangeSelected].length)} 
                tickFormat={(t) => new Date(ticks[rangeSelected][t-1]).getDate() + '/' + (new Date(ticks[rangeSelected][t-1]).getMonth()+1)} 
              />
              <VictoryBar
                domain={{y: [0, 1]}}//86400000 = 16*60*60*1000 = 16h
                style={{
                  parent: {
                    border: "1px solid #ccc"
                  },
                  data: {
                    fill: "#F53B91", stroke: "#F53B91", strokeWidth: 3, width: ((wiz*0.65)/(this.props.navigation.state.params.activityData[rangeSelected].length) )
                  },
                  labels: {
                    fontSize: 15, fill: "#B5B2B2"
                  }
                }}
                data={ this.props.navigation.state.params.activityData[rangeSelected] }
              />
            </VictoryChart>
          </View>

            
          <View style={{alignSelf:'center', alignContent:'center'}}>
            <RadioForm
              radio_props={rangeSelector}
              initial={0}
              onPress={(value) => { rangeSelected = value; this.forceUpdate();} }
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={"#F53B91"}
              labelColor={'#B5B2B2'}
              animation={true}
              buttonSize={5}
              buttonOuterSize={20}
            />
          </View>
          <View style={styles.scroll}>
            <ScrollView >
              <Text style={styles.body}>{lorem}</Text>
            </ScrollView> 
          </View>
        </View>
      )
  }
}

const styles = StyleSheet.create({
    container: {
      width:'100%',
      height:'100%'
    },
    chartContainer: {
        marginTop: 0,
        width:'100%',
        height: hait
    },

    scroll: {
        marginTop: '5%',
        height: '45%',
    },
    body:{
      marginHorizontal:'10%',
      fontFamily: "System",
      fontSize: 18,
      color: '#B5B2B2',
      fontWeight:'100'
    }
});

const _lorem = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.  Expetenda tincidunt in sed, ex partem placerat sea, porro commodo ex eam. His putant aeterno interesset at. Usu ea mundi tincidunt, omnium virtute aliquando ius ex. Ea aperiri sententiae duo. Usu nullam dolorum quaestio ei, sit vidit facilisis ea. Per ne impedit iracundia neglegentur. Consetetur neglegentur eum ut, vis animal legimus inimicus id.  His audiam deserunt in, eum ubique voluptatibus te. In reque dicta usu. Ne rebum dissentiet eam, vim omnis deseruisse id. Ullum deleniti vituperata at quo, insolens complectitur te eos, ea pri dico munere propriae. Vel ferri facilis ut, qui paulo ridens praesent ad. Possim alterum qui cu. Accusamus consulatu ius te, cu decore soleat appareat usu.  Est ei erat mucius quaeque. Ei his quas phaedrum, efficiantur mediocritatem ne sed, hinc oratio blandit ei sed. Blandit gloriatur eam et. Brute noluisse per et, verear disputando neglegentur at quo. Sea quem legere ei, unum soluta ne duo. Ludus complectitur quo te, ut vide autem homero pro.  Vis id minim dicant sensibus. Pri aliquip conclusionemque ad, ad malis evertitur torquatos his. Has ei solum harum reprimique, id illum saperet tractatos his. Ei omnis soleat antiopam quo. Ad augue inani postulant mel, mel ea qualisque forensibus.';
const lorem = _lorem + _lorem + _lorem;
//NavigationActions.reset({ index: 0, actions: [{type: NavigationActions.NAVIGATE, routeName: 'Login'}], key: null })