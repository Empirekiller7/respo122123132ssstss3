//Ficheiro models/class.mustache
const schemaAlbum = require('../schemas/Schema-Album.json');
const jsf = require('json-schema-faker');
const faker = require('faker');
const path = require("path");
const dbRelativePath = path.resolve("./publish/Database", "labs.db");
var database = require('../Database/sqlite-wrapper.js')(dbRelativePath);
jsf.extend('faker', () => { return faker });


class Album {
    constructor (name,foto, artist_id, song_id, tag_id, id) {
        this.id = id;
           
this.name=name;
this.foto=foto;
this.artist_id=artist_id;
this.song_id=song_id;
this.tag_id=tag_id;

        Object.defineProperty(this, 'id', { enumerable: false });
        Object.defineProperty(this, 'foto', { enumerable: false });
Object.defineProperty(this, 'artist_id', { enumerable: false, writable: true });
Object.defineProperty(this, 'song_id', { enumerable: false, writable: true });
Object.defineProperty(this, 'tag_id', { enumerable: false, writable: true });

    }

    static create(){
      return Object.assign(new Album(), jsf.generate(schemaAlbum));
    }

    static all(callback) { 
      database.where("SELECT * FROM  Album ", [], Album, callback);
    }

    static get(id, callback) {         
      database.get("SELECT * FROM Album WHERE id = ?", [id], Album, callback);
    }

    static delete(id, callback) {     
      database.run("DELETE FROM Album WHERE id = ?", [id], callback);
    }

    static many(model, id, callback){
      let tablename = "Album".localeCompare(model) === -1 ? "Album_" + model : model + "_Album";
      database.where(`SELECT Album.*
                      FROM Album
                      INNER JOIN ${tablename}
                      ON ${tablename}.Album_id = Album.id
                      WHERE ${tablename}.${model.toLowerCase()}_id = ?`, [id], Album, callback); 
    }

    static top(property,order,limit,callback) {     
      database.where(`SELECT * FROM Album ORDER BY ${property} ${order} LIMIT ${limit}`, [], Album, callback); 
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
        let thisAlbum = this;
            let lowCaseArtist = 'Artist'.toLowerCase();
            let relationArtistId = lowCaseArtist +'_id';
            let lowCaseSong = 'Song'.toLowerCase();
            let relationSongId = lowCaseSong +'_id';
            let lowCaseTag = 'Tag'.toLowerCase();
            let relationTagId = lowCaseTag +'_id';

        if(this.id) { 
           database.run("UPDATE Album SET name = ?, foto = ? where id = ?", [this.name, this.foto, this.id], 
             function(msg){
              database.run("DELETE FROM 'Album_Artist' where Album_id = ?", [this.id],  
                  (msg) => {                                       
                      thisAlbum.insertMM(relationArtistId, thisAlbum, 'Album', 'Album_Artist');                                          
                }); 
              database.run("DELETE FROM 'Album_Song' where Album_id = ?", [this.id],  
                  (msg) => {                                       
                      thisAlbum.insertMM(relationSongId, thisAlbum, 'Album', 'Album_Song');                                          
                }); 
              database.run("DELETE FROM 'Album_Tag' where Album_id = ?", [this.id],  
                  (msg) => {                                       
                      thisAlbum.insertMM(relationTagId, thisAlbum, 'Album', 'Album_Tag');                                          
                }); 
              callback(msg);
           }.bind(this));     
        } else { 
        
          
          //TODO CHECK IF NECESSARY
          Object.defineProperty(thisAlbum, 'id', { enumerable: true });

          database.run("INSERT INTO Album (name, foto) VALUES (?,?)", 
              [this.name, this.foto], 
                (msg) => { 
                  thisAlbum['id'] = msg.lastID;
                  callback(msg);
                        if(thisAlbum.id){   
                            thisAlbum.insertMM(relationArtistId, thisAlbum, 'Album', 'Album_Artist');
                        }
                        if(thisAlbum.id){   
                            thisAlbum.insertMM(relationSongId, thisAlbum, 'Album', 'Album_Song');
                        }
                        if(thisAlbum.id){   
                            thisAlbum.insertMM(relationTagId, thisAlbum, 'Album', 'Album_Tag');
                        }
                  }); 

        
         
        } 
    }

}

module.exports = Album;