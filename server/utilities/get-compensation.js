const Airport = require('../models/airport');
const haversine = require('s-haversine');

function compensation(distance, info){
  const RegulationCountries = ['France', 'Slovenia', 'Greece', 'Italy', 'Spain', 'United Kingdom', 'Germany',
  'Estonia', 'Malta', 'Portugal', 'Austria', 'Netherlands', 'Ireland', 'Finland', 'Denmark', 'Hungary',
  'Romania', 'Belgium', 'Bulgaria', 'Sweden', 'Czech Republic', 'Poland', 'Croatia',
  'Cyprus', 'Netherlands Antilles', 'Lithuania', 'Luxembourg', 'Slovakia', 'Iceland', 'Norway', 'Switzerland'];

  for(var y=0; y<RegulationCountries.length; y++){
    if(info.airports[0].country === RegulationCountries[y]){
      //vuelo intracomunitario
      if((info.airports[0].country && info.airports[info.airports.length -1].country) === (RegulationCountries[y])){
        if(distance <= 1500000) return 250;
        return 400;
      //flight from EU
      }else{
        if(distance <= 1500000) return 250;
        else if(distance >= 3500000) return 600;
        return 400;
      }
    }else if(info.airline.country === RegulationCountries[y]){
      //any EU airport
      for(var i=1; i<info.airports.length; i++){
        if(info.airports[i].country === RegulationCountries[y]){
          i= 1000;
          if(distance <= 1500000) return 250;
          else if(distance >= 3500000) return 600;
          return 400;
        }else{
          if((i === info.airports.length -1) && (y === RegulationCountries.length -1)) return 0;
        }
      }
    }else if(y === RegulationCountries.length - 1) return 0;
  }
}

function getCompensation(info){
  let distance = haversine.distance(info.airports[0].location, info.airports[info.airports.length -1].location);
  let money = compensation(distance, info);
  if(info.claimType !== 'Delay less than 3 hours') return money;
  else return 0;
}

module.exports = getCompensation;
