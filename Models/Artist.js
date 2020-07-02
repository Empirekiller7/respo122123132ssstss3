//Ficheiro models/class.mustache
const schemaArtist = require('../schemas/Schema-Artist.json');
const jsf = require('json-schema-faker');
const faker = require('faker');
const path = require("path");
const dbRelativePath = path.resolve("./publish/Database", "labs.db");
var database = require('../Database/sqlite-wrapper.js')(dbRelativePath);
jsf.extend('faker', () => { return faker });


class Artist {
    constructor (name,country, song_id, tag_id, id) {
        this.id = id;
           
this.name=name;
this.country=country;
this.song_id=song_id;
this.tag_id=tag_id;

        Object.defineProperty(this, 'id', { enumerable: false });
        Object.defineProperty(this, 'country', { enumerable: false });
Object.defineProperty(this, 'song_id', { enumerable: false, writable: true });
Object.defineProperty(this, 'tag_id', { enumerable: false, writable: true });

    }

    static create(){
      return Object.assign(new Artist(), jsf.generate(schemaArtist));
    }

    static all(callback) { 
      database.where("SELECT * FROM  Artist ", [], Artist, callback);
    }

    static get(id, callback) {         
      database.get("SELECT * FROM Artist WHERE id = ?", [id], Artist, callback);
    }

    static delete(id, callback) {     
      database.run("DELETE FROM Artist WHERE id = ?", [id], callback);
    }

    static many(model, id, callback){
      let tablename = "Artist".localeCompare(model) === -1 ? "Artist_" + model : model + "_Artist";
      database.where(`SELECT Artist.*
                      FROM Artist
                      INNER JOIN ${tablename}
                      ON ${tablename}.Artist_id = Artist.id
                      WHERE ${tablename}.${model.toLowerCase()}_id = ?`, [id], Artist, callback); 
    }

    static top(property,order,limit,callback) {     
      database.where(`SELECT * FROM Artist ORDER BY ${property} ${order} LIMIT ${limit}`, [], Artist, callback); 
      }

    insertMM(relationClassId, thisClass, thisClassName, tableName){
        if(Array.isArray(thisClass[relationClassId.toString()])){
          thisClass[relationClassId].forEach((element) => {
            let query = "INSERT INTO "+ tableName+ " ("+ thisClassName.toLowerCase() + '_id, '+ relationClassId +") VALUES (?,?)";
            //TODO MAYBE EXEC
            database.run(query, [thisClass.id, element], null); 
          })
        }
    }

   

    save(callback) {    
        let thisArtist = this;
            let lowCaseSong = 'Song'.toLowerCase();
            let relationSongId = lowCaseSong +'_id';
            let lowCaseTag = 'Tag'.toLowerCase();
            let relationTagId = lowCaseTag +'_id';

        if(this.id) { 
           database.run("UPDATE Artist SET name = ?, country = ? where id = ?", [this.name, this.country, this.id], 
             function(msg){
              database.run("DELETE FROM 'Artist_Song' where Artist_id = ?", [this.id],  
                  (msg) => {                                       
                      thisArtist.insertMM(relationSongId, thisArtist, 'Artist', 'Artist_Song');                                          
                }); 
              database.run("DELETE FROM 'Artist_Tag' where Artist_id = ?", [this.id],  
                  (msg) => {                                       
                      thisArtist.insertMM(relationTagId, thisArtist, 'Artist', 'Artist_Tag');                                          
                }); 
              callback(msg);
           }.bind(this));     
        } else { 
        
          
          //TODO CHECK IF NECESSARY
          Object.defineProperty(thisArtist, 'id', { enumerable: true });

          database.run("INSERT INTO Artist (name, country) VALUES (?,?)", 
              [this.name, this.country], 
                (msg) => { 
                  thisArtist['id'] = msg.lastID;
                  callback(msg);
                        if(thisArtist.id){   
                            thisArtist.insertMM(relationSongId, thisArtist, 'Artist', 'Artist_Song');
                        }
                        if(thisArtist.id){   
                            thisArtist.insertMM(relationTagId, thisArtist, 'Artist', 'Artist_Tag');
                        }
                  }); 

        
         
        } 
    }

}

module.exports = Artist;