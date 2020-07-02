//Ficheiro models/class.mustache
const schemaSong = require('../schemas/Schema-Song.json');
const jsf = require('json-schema-faker');
const faker = require('faker');
const path = require("path");
const dbRelativePath = path.resolve("./publish/Database", "labs.db");
var database = require('../Database/sqlite-wrapper.js')(dbRelativePath);
jsf.extend('faker', () => { return faker });


class Song {
    constructor (name,duration,instrumental,lyrics,foto, genre_id, tag_id, id) {
        this.id = id;
           
this.name=name;
this.duration=duration;
this.instrumental=instrumental;
this.lyrics=lyrics;
this.foto=foto;
this.genre_id=genre_id;
this.tag_id=tag_id;

        Object.defineProperty(this, 'id', { enumerable: false });
        Object.defineProperty(this, 'duration', { enumerable: false });
Object.defineProperty(this, 'instrumental', { enumerable: false });
Object.defineProperty(this, 'lyrics', { enumerable: false });
Object.defineProperty(this, 'foto', { enumerable: false });
Object.defineProperty(this, 'genre_id', { enumerable: false, writable: true });
Object.defineProperty(this, 'tag_id', { enumerable: false, writable: true });

    }

    static create(){
      return Object.assign(new Song(), jsf.generate(schemaSong));
    }

    static all(callback) { 
      database.where("SELECT * FROM  Song ", [], Song, callback);
    }

    static get(id, callback) {         
      database.get("SELECT * FROM Song WHERE id = ?", [id], Song, callback);
    }

    static delete(id, callback) {     
      database.run("DELETE FROM Song WHERE id = ?", [id], callback);
    }

    static many(model, id, callback){
      let tablename = "Song".localeCompare(model) === -1 ? "Song_" + model : model + "_Song";
      database.where(`SELECT Song.*
                      FROM Song
                      INNER JOIN ${tablename}
                      ON ${tablename}.Song_id = Song.id
                      WHERE ${tablename}.${model.toLowerCase()}_id = ?`, [id], Song, callback); 
    }

    static top(property,order,limit,callback) {     
      database.where(`SELECT * FROM Song ORDER BY ${property} ${order} LIMIT ${limit}`, [], Song, callback); 
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
        let thisSong = this;
            let lowCaseTag = 'Tag'.toLowerCase();
            let relationTagId = lowCaseTag +'_id';

        if(this.id) { 
           database.run("UPDATE Song SET name = ?, duration = ?, instrumental = ?, lyrics = ?, foto = ?, genre_id = ? where id = ?", [this.name, this.duration, this.instrumental, this.lyrics, this.foto, this.genre_id, this.id], 
             function(msg){
              database.run("DELETE FROM 'Song_Tag' where Song_id = ?", [this.id],  
                  (msg) => {                                       
                      thisSong.insertMM(relationTagId, thisSong, 'Song', 'Song_Tag');                                          
                }); 
              callback(msg);
           }.bind(this));     
        } else { 
        
          
          //TODO CHECK IF NECESSARY
          Object.defineProperty(thisSong, 'id', { enumerable: true });

          database.run("INSERT INTO Song (name, duration, instrumental, lyrics, foto, genre_id) VALUES (?,?,?,?,?,?)", 
              [this.name, this.duration, this.instrumental, this.lyrics, this.foto, this.genre_id], 
                (msg) => { 
                  thisSong['id'] = msg.lastID;
                  callback(msg);
                        if(thisSong.id){   
                            thisSong.insertMM(relationTagId, thisSong, 'Song', 'Song_Tag');
                        }
                  }); 

        
         
        } 
    }

}

module.exports = Song;